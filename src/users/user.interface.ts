export interface User{
    username: string,
    email: string,
    password: string
}

export interface UnitUser extends User{
    id: string
}

/*
The Users interface represents a collection of user objects, 
where the keys are strings and 
the values are UnitUser objects.
*/ 

export interface Users{
    [key: string] : UnitUser
}