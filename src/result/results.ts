

export class Result<T, E> {
    private success?: T
    private err?: E
    private constructor(success?: T, err?: E) {
        this.success = success
        this.err = err
    }
    public onOk(f: (v: T) => void): Result<T,E> {
        if (this.success != null) {
            f(this.success)
        }
        return this
    }
    public onErr(f: (v: E) => void): Result<T,E> {
        if (this.err != null) {
            f(this.err)
        }
        return this
    }

    public static OK<T>(v :T): Result<T, null> {
        return new Result<T, null>(v, null)
    }
    public static ERR<E>(v: E): Result<any, E> {
        return new Result<any, E>(null,v)
    }
}