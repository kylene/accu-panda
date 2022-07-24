// TODO add more tests here
const { createBigPandaAlertRequest, bigPandaUrl, bigPandaAppKey } = require("../services/bigPandaService");

describe("createBigPandaAlertRequest()", () => {
    test("list of one condition => transformed to BigPanda request successfully", () => {
        const conditions = [
            {
                LocationKey: '32581_pc',
                LocalObservationDateTime: '2022-07-23T18:53:00-05:00',
                EpochTime: 1658620380,
                WeatherText: 'Partly sunny',
                WeatherIcon: 3,
                HasPrecipitation: false,
                PrecipitationType: null,
                IsDayTime: true,
                Temperature:{
                    Metric:{
                        Value:37,
                        Unit:"C",
                        UnitType:17
                    },
                    Imperial:{
                        Value:99,
                        Unit:"F",
                        UnitType:18
                    }
                },
                MobileLink: 'http://www.accuweather.com/en/us/dallas-tx/75201/current-weather/32581_pc?lang=en-us',
                Link: 'http://www.accuweather.com/en/us/dallas-tx/75201/current-weather/32581_pc?lang=en-us'
            }
        ]

        const result = createBigPandaAlertRequest(conditions);

        expect(result.method).toEqual('post');
        expect(result.url).toEqual(bigPandaUrl)
        expect(Object.keys(result.headers).length).toEqual(1);
        expect(Object.keys(result.headers)).toContain('Authorization');
        expect(result.data.app_key).toEqual(bigPandaAppKey);
        expect(result.data.alerts.length).toEqual(1);

        const alert = result.data.alerts[0];

        expect(alert.status).toEqual('warning');
        expect(alert.timestamp).toEqual(1658620380);
        expect(alert.primaryProperty).toEqual('32581_pc');
        expect(alert.secondaryProperty).toEqual('temperature');
        expect(alert.description).toEqual('Temperature has exceeded 90 degrees.');
        expect(alert.LocationKey).toEqual('32581_pc');
        expect(alert.LocalObservationDateTime).toEqual('2022-07-23T18:53:00-05:00');
        expect(alert.EpochTime).toEqual('1658620380');
        expect(alert.WeatherText).toEqual('Partly sunny');
        expect(alert.WeatherIcon).toEqual('3');
        expect(alert.HasPrecipitation).toEqual('false');
        expect(alert.PrecipitationType).toEqual(undefined);
        expect(alert.IsDayTime).toEqual('true');
        expect(alert.Temperature_Metric).toEqual('37 C');
        expect(alert.Temperature_Imperial).toEqual('99 F');
        expect(alert.MobileLink).toEqual('http://www.accuweather.com/en/us/dallas-tx/75201/current-weather/32581_pc?lang=en-us');
        expect(alert.Link).toEqual('http://www.accuweather.com/en/us/dallas-tx/75201/current-weather/32581_pc?lang=en-us');
    })
});