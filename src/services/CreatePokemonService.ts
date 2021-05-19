import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Pokemon from '../models/Pokemon';

interface Request {
  identifier: string;
  species_id: string;
  height: string;
  weight: string;
  order: string;
  is_default: string;
}

class CreatePokemonService {
  public async execute({
    identifier,
    species_id,
    height,
    weight,
    order,
    is_default,
  }: Request): Promise<Pokemon> {
    const PokemonRepository = getRepository(Pokemon);

    const checkPokemonExists = await PokemonRepository.findOne({
      where: { identifier },
    });
    if (checkPokemonExists) {
      throw new AppError('Pokemon indentifier already used.');
    }

    const pokemon = PokemonRepository.create({
      identifier,
      species_id,
      height,
      weight,
      order,
      is_default,
    });
    await PokemonRepository.save(pokemon);

    return pokemon;
  }
}

export default CreatePokemonService;
