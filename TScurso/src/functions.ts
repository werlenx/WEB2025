interface MathFunc {
    (x:number, y:number):number;
}



const sum = (x: number, y:number):string => {
    return (x+y).toString()
}

const value = sum(2,3)


const log= (message:string):void => {
    console.log(message)
}


const sum2: MathFunc = (x:number, y:number):number =>{
    return x+y;
}

const sub: MathFunc = (x:number, y:number):number =>{
    return x-y;
}