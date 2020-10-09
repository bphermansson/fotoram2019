import { Injectable } from '@angular/core';

class Hero {
  id: number;
  name: string;
}
var HEROES: Hero[] = [
  {id: 11, name: 'Mr. Nice'}
];

@Injectable({
  providedIn: 'root'
})
export class TempService {

  constructor() { }

  getHeroes(): Hero[] {
    return HEROES;
  }
}
