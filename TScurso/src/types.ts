//tipos básicos
let age: number = 5
const name: string = "Werlen"
const isAdmin: boolean = true
const firstApm: any = "Gomes" //mesmo que nada


const list: number[] = [1,2,3,4,5]
const list2: Array<number> = [1,2,3,4,5]

const arr: string[] = ["A","B","C"]
const arr2: Array<string> = ["A","B","C"]

const arrBool: boolean[] = [true, false]
const arrBool2: Array<boolean> = [true, false]

const arrAll: any[] = [1,"B",true]
const arrAll2: Array<any> = [1,"B",true]

//tupla
//pega na exata ordem especificada
const person: [number, string] = [1, "jane"]

const people: [number, string][] = [
    [1, 'jane'],
    [2, 'Joe']
]

//Intersections
const productID: string | number | boolean = false

//Enum
enum direction {
    up = 1,
    Down = -1,
    Left = 'Esquerda',
    Rigth = 'Direita'
}

console.log(direction.up)


//type assertions - quando vc quer mudar o tipo da variavel

const productName: any = 'camisa'

let itemId1
let itemId2

itemId2 = productName
itemId1 = productName as string

console.log(
    typeof(itemId1),
    typeof(itemId2)
)



