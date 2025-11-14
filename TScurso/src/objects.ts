//type
type Order = {
    productName: string;
    price: number;
}

type User = {
    firstName: string;
    age?: number;
    email: string;
    password: string;
    orders: Order[];
    register?():string;
}

const user: User = {
    firstName: 'werlen',
    email: 'werlen@example.com',
    password: 'hashPassword',
    orders: [
        {productName: 'camisa', price: 21},
        {productName: 'carro', price: 5}
    ],
    register(){
        return 'register sucessfull'
    }
}
//parametro opcionais
const printLog = (msg?: number) => {}

printLog(user.age)

//Unions

type Author = {
    books: string[]
}

const author: Author & User = {
    firstName: 'werlen',
    age: 21,
    email: 'radom',
    password: 'simples',
    orders: [{productName: 'void', price: 14}],
    books: ['Mundo de sofia', 'Inferno de Dante']

};


//interfaces

interface userInterface{
    readonly firstName: string;
    email: string
}

const userProps: userInterface ={
    firstName: 'werlen',
    email: "werlen@example.com"
}

