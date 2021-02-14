d3.json("/api/v1.0/all_data").then((data) => {
    var tbody = d3.select("#tbodydata");
    data.forEach(dataelement => {
    console.log (dataelement.show_id)
    appended_row = tbody.append("tr")
    appended_row.append ("td").text(dataelement.show_id)
    appended_row.append ("td").text(dataelement.title)
    appended_row.append ("td").text(dataelement.date_added)
    appended_row.append ("td").text(dataelement.release_year)
    appended_row.append ("td").text(dataelement.duration)
    appended_row.append ("td").text(dataelement.description)
    appended_row.append ("td").text(dataelement.director_name)
    appended_row.append ("td").text(dataelement.player_name)
    appended_row.append ("td").text(dataelement.pg_rating)
    appended_row.append ("td").text(dataelement.imdb_rating)
    appended_row.append ("td").text(dataelement.rotten_tomatoes_rating)
    appended_row.append ("td").text(dataelement.awards)
    appended_row.append ("td").text(dataelement.released_date)
    appended_row.append ("td").text(dataelement.budget)
    appended_row.append ("td").text(dataelement.revenue)
    appended_row.append ("td").text(dataelement.country_name)
    appended_row.append ("td").text(dataelement.listed_in)
    });
})