import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './Interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonmodel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) { }



  async executeSeed() {

    await this.pokemonmodel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');

    const pokemonToInsert: ({ name: string, no: number })[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      //const pokemon = await this.pokemonmodel.create({ name, no })



      pokemonToInsert.push({ name, no });




    });


    await this.pokemonmodel.insertMany(pokemonToInsert);



    return 'seed executed';
  }

}
