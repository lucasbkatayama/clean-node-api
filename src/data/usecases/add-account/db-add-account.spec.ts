import { DbAddAccount } from "./db-add-account";
import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from "./db-add-account-protocols";

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
})

interface SutTypes {
    sut: DbAddAccount,
    HasherStub: Hasher,
    AddAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const HasherStub = makeHasher()
    const AddAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(HasherStub, AddAccountRepositoryStub)
    return {
        sut,
        HasherStub,
        AddAccountRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('should call Hasher with correct password', async () => {
        const { sut, HasherStub } = makeSut()
        const hashSpy = jest.spyOn(HasherStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(hashSpy).toHaveBeenCalledWith('valid_password')
    });

    test('should throw if Hasher throws', async () => {
        const { sut, HasherStub } = makeSut()
        jest.spyOn(HasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error)))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    });

    test('should call AddAccountRepository with correct values', async () => {
        const { sut, AddAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(AddAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_password'
        })
    });

    test('should throw if AddAccountRepository throws', async () => {
        const { sut, AddAccountRepositoryStub } = makeSut()
        jest.spyOn(AddAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error)))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    });

    test('should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makeFakeAccount())
    });
});