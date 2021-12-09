import { getRepository } from 'typeorm';

import { Pix } from '../../entities/Pix';
import { User } from '../../entities/User';
import AppError from '../../shared/error/AppError';
import { encodeKey, decodeKey } from '../../utils/pix';

export default class PixService {
  async request(value: number, user: Partial<User>) {
    const pixRepository = getRepository(Pix);
    const userRepository = getRepository(User);

    const currentUser = await userRepository.findOne({
      where: { id: user.id },
    });
    // Requesting PIX to another USER
    const requestData = {
      requestingUser: currentUser,
      value,
      status: 'open',
    };
    const register = await pixRepository.save(requestData);

    const key = encodeKey(user.id || '', value, register.id);

    return key;
  }

  // User Payer the request PIX
  async pay(key: string, user: Partial<User>) {
    const keyDecoded = decodeKey(key);

    if (keyDecoded.userId === user.id) {
      throw new AppError('Não é possivel receber o PIX do mesmo usuário', 401);
    }

    const pixRepository = getRepository(Pix);
    const userRepository = getRepository(User);

    const requestingUser = await userRepository.findOne({
      where: { id: keyDecoded.userId },
    });

    const payingUser = await userRepository.findOne({ where: { id: user.id } });

    // Check if payer have sufficient amount to pay the value requested
    if (payingUser?.wallet && payingUser.wallet < Number(keyDecoded.value)) {
      throw new AppError('Não há saldo suficiente para fazer o pagamento', 401);
    }
    // Check if payee or payer exists
    if (!requestingUser || !payingUser) {
      throw new AppError(
        'Não encontramos os clientes da transação, gere uma nova chave',
        401,
      );
    }

    // Deposit for who is receiving
    requestingUser.wallet =
      Number(requestingUser?.wallet) + Number(keyDecoded.value);
    await userRepository.save(requestingUser);

    // Withdraw for who is paying
    payingUser.wallet = Number(payingUser?.wallet) - Number(keyDecoded.value);
    await userRepository.save(payingUser);

    // Update status opened to closed the pix transaction
    const pixTransaction = await pixRepository.findOne({
      where: { id: keyDecoded.registerId, status: 'open' },
    });

    if (!pixTransaction) {
      throw new AppError('Chave inválida para pagamento', 401);
    }

    pixTransaction.status = 'close';
    pixTransaction.payingUser = payingUser;

    await pixRepository.save(pixTransaction);

    return { msg: 'Pagamento efetuado com sucesso' };
  }

  // Statement - RECEIVED AND PAYED - Final Balance
  async transactions(user: Partial<User>) {
    const pixRepository = getRepository(Pix);

    const pixReceived = await pixRepository.find({
      where: { requestingUser: user.id, status: 'close' },
      relations: ['payingUser'],
    });

    const pixPaying = await pixRepository.find({
      where: { payingUser: user.id, status: 'close' },
      relations: ['requestingUser'],
    });

    const received = pixReceived.map(transaction => ({
      value: transaction.value,
      user: {
        firstname: transaction.payingUser.firstName,
        lastName: transaction.payingUser.lastName,
      },
      updatedAt: transaction.updatedAt,
      type: 'received',
    }));

    const paying = pixPaying.map(transaction => ({
      value: transaction.value,
      user: {
        firstname: transaction.requestingUser.firstName,
        lastName: transaction.requestingUser.lastName,
      },
      updatedAt: transaction.updatedAt,
      type: 'paid',
    }));

    const allTransactions = received.concat(paying);

    allTransactions.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateA < dateB ? 1 : -1;
    });

    return allTransactions;
  }
}
