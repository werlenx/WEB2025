const returnValues = <T>(value:T):T => value

const message = returnValues<string>('hello word')
const number = returnValues<number>(1)


function getFirstValuesFromArray<type>(array:type[]){
     return array[0];
}

const firtValuesFromStringArray = getFirstValuesFromArray<string>(['1','2'])
const firtValuesFromNumberArray = getFirstValuesFromArray<number>([10, 20])


const returnPromise = async (): Promise<number> => {
    return 5
}

class GenericNumber<T>{
    zeroValue:T;
    sum:(x:T, y:T) => T;

    constructor (zeroValue:T, sum:(x:T, y:T) => T){
        this.zeroValue = zeroValue;
        this.sum = sum
    }
}

const myGenericNumber = new GenericNumber<number>(0,(x:number, y:number) => {
    return x+y
})