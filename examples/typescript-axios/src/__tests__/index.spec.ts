import MockAdapter from "axios-mock-adapter";
import {PetApi} from "../apis";
import axios from "axios";

beforeAll(() => {
  const mock = new MockAdapter(axios);
  mock.onGet("/pets").reply(200, [{id: 0, foods:['Peanuts']}]);
  mock.onGet("/pets/0").reply(200, {id: 0, foods:['Peanuts']});
});

it('should be call',async () => {
  const PetAPI = new PetApi({axios});
  await expect(PetAPI.findPets())
    .resolves.toHaveProperty('data',[{id: 0, foods:['Peanuts']}])
  await expect(PetAPI.findPetById(0))
    .resolves.toHaveProperty('data',{id: 0, foods:['Peanuts']})
});
