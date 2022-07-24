const { getLocationKeyByZipCode } = require("../services/accuWeatherService");
const axios = require("axios");

jest.mock("axios");

describe('getLocationKeyByZipCode()', () => {
    test('zip code is not 5 characters => error is thrown', () => {
        expect(() => getLocationKeyByZipCode('123456')).rejects.toThrowError('ZIP Code must be 5 characters long.')
    });

    test('response code is not 200 => error is thrown', () => {
        const res = {
            status: 401,
            statusText: 'Unauthorized. API authorization failed.'
        };

        axios.get.mockResolvedValueOnce(res);

        expect(() => getLocationKeyByZipCode('12345')).rejects.toThrowError('Unauthorized. API authorization failed.')
    });

    // TODO: more tests for getLocationKeyByZipCode()
});

// TODO: tests for getConditionsByLocationKey()
describe('getConditionsByLocationKey()', () => {

});