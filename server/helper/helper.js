function parseLine(line) {
    tokens = line.split(",");
    if (tokens.length == 0) {
        return [];
    }

    return tokens;
}


function parseData(data) {
    if (data.charAt(data.length - 1) === "\n") {
        data = data.substr(0, data.length - 1);
    }

    lines = data.split("\n");

    if (lines.length == 0) {
        return null;
    }

    var headers = parseLine(lines[0]);
    var countryInd = -1;
    var yearInd = -1;
    var valueInd = -1;

    for (var i = 0; i < headers.length; i++) {
        if ((headers[i].toLowerCase() === "entity" || headers[i].toLowerCase() === "country") && countryInd == -1) {
            countryInd = i;
        } else if (headers[i].toLowerCase() === "year" && yearInd == -1) {
            yearInd = i;
        } else if (valueInd == -1) {
            valueInd = i;
        }
    }

    if (countryInd == -1 || yearInd == -1) {
        return null;
    }

    var tuples = [];

    for (var i = 1; i < lines.length; i++) {
        var tokens = parseLine(lines[i]);
        var maxIndex = Math.max(Math.max(countryInd, yearInd), valueInd);
        if (tokens.length < maxIndex + 1) {
            continue;
        }

        var country = tokens[countryInd];
        var year = parseInt(tokens[yearInd]);
        var value = parseFloat(tokens[valueInd]);

        if (isNaN(year) || isNaN(value)) {
            continue;
        }

        var tuple = [country, year, value];
        tuples.push(tuple);
    }

    return tuples;
}

module.exports = { parseData };