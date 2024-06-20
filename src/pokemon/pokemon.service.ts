import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonmodel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonmodel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExeptions(error);
    }


  }

  findAll() {
    return this.pokemonmodel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonmodel.findOne({ no: term });

    } else if (isValidObjectId(term)) {
      pokemon = await this.pokemonmodel.findById(term);
    } else {
      pokemon = await this.pokemonmodel.findOne({ name: term.toLocaleLowerCase().trim() })
    }




    if (!pokemon) {
      throw new BadRequestException(`Ese pokemon no existe, el nombre, id o numero esta incorrecto: ${term}`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
    } catch (error) {
      this.handleExeptions(error);
    }


    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }


  async remove(id: string) {
    //const result = await this.pokemonmodel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonmodel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id: ${id} not found`);
    }

    return;
  }


  private handleExeptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException('Cant create pokemon -- problem in console log');
  }





}
