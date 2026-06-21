class DataService {
    requestData(languageCode) {
        const url = `${AppConfig.DATA_BASE_URL}resume_data_${languageCode}.json`;
        const responseText = httpGetRequest(url);
        return JSON.parse(responseText);
    }
}
