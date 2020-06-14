import MockAdapter from "axios-mock-adapter";
import {PetApi} from "../clients";
import axios from "axios";

it('should be call', async () => {
  new FormData()
  const PetAPI = new PetApi({
    axios,
    security: {http: {username: 'http', password: 'http'}, apiKey: 'apiKey', oauth2: 'oauth2', openIdConnect: 'openIdConnect'}
  });
  await expect(PetAPI.findPets())
    .resolves.toHaveProperty('data', [{id: 0, foods: ['Peanuts']}])
  await expect(PetAPI.findPets({name: 'ore'}))
    .resolves.toHaveProperty('data', [{id: 0, foods: ['Ore']}])
  await expect(PetAPI.findPetById(0))
    .resolves.toHaveProperty('data', {id: 0, foods: ['Peanuts']})
});

new MockAdapter(axios)
  .onGet(/\/pets$/).reply((config) => config.params.name === 'ore' ? [200, [{id: 0, foods: ['Ore']}]] : [200, [{id: 0, foods: ['Peanuts']}]])
  .onGet(/\/pets\/\d$/).reply(200, {id: 0, foods: ['Peanuts']})
  .onAny().passThrough();
