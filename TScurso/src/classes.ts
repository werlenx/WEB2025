interface IPerson{
    id:number;
    sayMyName(): string
}

class Person implements IPerson{
    readonly id:number;
    protected name:string;
    private age:number

    constructor(id:number, name:string, age:number){
        this.id = id;
        this.name = name;
        this.age = age;
    }

    sayMyName():string{
        return this.name
    }
}
//definindo classses de um jeito simples
class PerdonRefact{
    constructor(
        id:number,
        name:string,
        age:number
    ){}
}

class Employe extends Person{
    constructor(id:number, name:string, age:number){
        super(id, name, age)
    }
}


const person = new Person(1, "Felipe", 21)