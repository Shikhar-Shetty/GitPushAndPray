# Nearby prediction demo mode

`POST /predict/nearby` accepts an optional `demo_mode` boolean. It defaults to
`false`, so ordinary requests use the weather values returned by Open-Meteo
without modification. To request a demonstration prediction, include
`"demo_mode": true` in the JSON body:

```json
{
	"latitude": 12.97,
	"longitude": 77.59,
	"demo_mode": true
}
```

Demo mode multiplies the rainfall and water-level model inputs by
`DEMO_FEATURE_MULTIPLIER`, which defaults to `2.0`. Set that environment
variable to another finite value greater than `1` to adjust the effect. The
API response identifies demo predictions and the multiplier, and generated
explanations disclose that the result is simulated. This mode is for
demonstrations only, not real-world flood warnings.
