import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository } from 'typeorm';

import Pokemon from '../models/Pokemon';

interface CSVPokemon {
  identifier: string;
  species_id: string;
  height: string;
  weight: string;
  order: string;
  is_default: string;
}

class ImportPokemonService {
  public async execute(filePath: string): Promise<Pokemon[]> {
    const PokemonRepository = getRepository(Pokemon);
    const contactsReadStream = fs.createReadStream(filePath);
    const parses = csvParse({
      from_line: 2,
    });
    const parseCSV = contactsReadStream.pipe(parses);
    const pokemons: CSVPokemon[] = [];

    parseCSV.on('data', async line => {
      const [
        identifier,
        species_id,
        height,
        weight,
        order,
        is_default,
      ] = line.map((cell: string) => cell.trim());

      pokemons.push({
        identifier,
        species_id,
        height,
        weight,
        order,
        is_default,
      });
    });
    await new Promise(resolve => parseCSV.on('end', resolve));

    const createdPokemon = PokemonRepository.create(
      pokemons.map(pokemon => ({
        identifier: pokemon.identifier,
        species_id: pokemon.species_id,
        height: pokemon.height,
        weight: pokemon.weight,
        order: pokemon.order,
        is_default: pokemon.is_default,
      })),
    );
    console.log(createdPokemon);
    await PokemonRepository.save(createdPokemon);
    await fs.promises.unlink(filePath);

    return createdPokemon;
  }
}

export default ImportPokemonService;
