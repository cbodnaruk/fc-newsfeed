const safeJSONParse = (JSONObj, defaultValue) => {
    try {
        const parsedValue = JSON.parse(JSONObj);
        return parsedValue;
    } catch (e) {
        console.log("ERROR: Could not parse JSON value " + JSONObj);
        return defaultValue;
    }
  }