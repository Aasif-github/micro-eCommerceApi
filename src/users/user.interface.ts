export interface User{    
    username: string,
    email:string,
    password: string
}

export interface UnitUser extends User{
    id:string
}

// here, Key of Users-Object can be string. and value are of UnitUser type ie.[Object-type].which means each user object in the collection should conform to the UnitUser interface.

export interface Users{
    [key: string]: UnitUser
}