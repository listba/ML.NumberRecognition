# ML.NumberRecognition
Machine Learning Number Recognition using Azure

You will need node and npm installed to run the app. You will also need to provide a config.json file with the following attributes: wsUrl and apiKey.

The training data is saved as a csv file, you an upload this to Azure ML and create a predictive api using this training data. you will also want to project the columns to limit the request and response inputs.

Demo of working app can be found here: http://ml.benlist.net/

Run the following commands to get started
```bash
npm install
npm run build
npm run start
```
