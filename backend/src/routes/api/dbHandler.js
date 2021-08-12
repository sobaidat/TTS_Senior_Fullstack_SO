"use strict";

const queryAllHotels = async function ( h ) {
    console.log("retrieving all hotels...");

    const hotels = await h.sql`SELECT
            id
            , name
        FROM  hotel
        ORDER BY name`;
    
    return hotels;
};

const queryHotelByIdAndDateRange = async function ( h, id, fromDate, toDate ) {
    console.log("retrieving hotel data...");

    const hotelData = await h.sql`SELECT
            hotel_id
            , score
            , comment 
            , to_char(created_date, 'DD/MM/YYYY') AS "reviewDate"
        FROM  review
        WHERE hotel_id = ${id} AND TO_DATE(to_char(created_date, 'DD/MM/YYYY'), 'DD/MM/YYYY') >= TO_DATE(${fromDate}, 'DD/MM/YYYY') AND TO_DATE(to_char(created_date, 'DD/MM/YYYY'), 'DD/MM/YYYY') < TO_DATE(${toDate}, 'DD/MM/YYYY')`;
            
    return hotelData;
};

module.exports = {
    queryAllHotels,
    queryHotelByIdAndDateRange
};