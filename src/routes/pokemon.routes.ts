import { Router } from 'express';
import multer from 'multer';
import CreatePokemonService from '../services/CreatePokemonService';
import ImportPokemonService from '../services/ImportPokemonService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const pokemonRouter = Router();

pokemonRouter.post('/', async (request, response) => {
  try {
    const {
      identifier,
      species_id,
      height,
      weight,
      order,
      is_default,
    } = request.body;

    const createUser = new CreatePokemonService();

    const pokemon = await createUser.execute({
      identifier,
      species_id,
      height,
      weight,
      order,
      is_default,
    });

    return response.json(pokemon);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

pokemonRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importPokemons = new ImportPokemonService();
    const pokemons = await importPokemons.execute(request.file.path);

    return response.json(pokemons);
  },
);

export default pokemonRouter;
