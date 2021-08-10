"use strict";

const dotenv = require( "dotenv" );
const postgres = require( "postgres" );

const init = async () => {
  // read environment variables
  dotenv.config();

  try {
    // connect to the local database server
    const sql = postgres();

    console.log( "dropping hotel table, if exists..." );
    await sql`DROP TABLE IF EXISTS hotel`;

    console.log( "creating hotel table..." );
    await sql`CREATE TABLE IF NOT EXISTS hotel (
      id INT NOT NULL PRIMARY KEY
      , name varchar(50) NOT NULL
    )`;

    console.log( "dropping review table, if exists..." );
    await sql`DROP TABLE IF EXISTS review`;

    console.log( "creating review table..." );
    await sql`CREATE TABLE IF NOT EXISTS review (
      id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
      , hotel_id INT NOT NULL
      , score INT
      , comment varchar(250)
      , created_date date
    )`;
	
	  console.log( "inserting hotels data..." );
    await sql`INSERT INTO hotel VALUES (1, 'InterContinental')`;
    await sql`INSERT INTO hotel VALUES (2, 'Crowne Plaza')`;
    await sql`INSERT INTO hotel VALUES (3, 'W Amman')`;
    await sql`INSERT INTO hotel VALUES (4, 'Fairmont')`;
    await sql`INSERT INTO hotel VALUES (5, 'Kempinski')`;
    await sql`INSERT INTO hotel VALUES (6, 'Grand Hyatt Amman')`;
    await sql`INSERT INTO hotel VALUES (7, 'The St. Regis Amman')`;
    await sql`INSERT INTO hotel VALUES (8, 'Amman Rotana')`;
    await sql`INSERT INTO hotel VALUES (9, 'Moevenpick')`;
    await sql`INSERT INTO hotel VALUES (10, 'Thousand Nights Hotel')`;

    console.log( "inserting random hotel reviews data..." );

    let comments = [
      'Excellent location and room was first class',
      'Beautiful old property',
      'A brief stay, but thoroughly enjoyable',
      'I had a great stay',
      'Lovely building, really friendly and homely atmosphere, very welcoming',
      'Very friendly staff',
      'The food was amazing',
      'New menu was not to our liking, not as much choice and small portions',
      'The staff were really friendly and the hotel itself was full of charm',
      'Very well presented, clean and tidy',
      'No comment',
      'lack of range of continental breakfast',
      'Had to make toast via a toaster. Really slow, apart from that, brilliant',
      'Great hotel with lovely staff and great food',
      'There was nothing not to like',
      'Really nice place to stay. Good size bedroom. Food was very good',
      'Love this hotel, comfortable, friendly and clean. Great food too!',
      'Lovely relaxing in stay in excellent location',
      'Everything was above expectations'      
    ];

    for(var i=0; i < 50000; i++) {
      sql`INSERT INTO review ( hotel_id, score, comment, created_date ) VALUES ( floor(random() * 10 + 1)::int, floor(random() * 5 + 1)::int, ${comments[Math.floor(Math.random() * 20)]},  
                                  '1/1/2019'::date + ('1 year'::interval*floor(random()*2)) + ('1 day'::interval*floor(random()*30)) + ('1 month'::interval*floor(random()*12)) )`;
    }
    await sql.end();
  } catch ( err ) {
    console.log( err );
    throw err;
  }
};

init().then( () => {
  console.log( "finished" );
} ).catch( () => {
  console.log( "finished with errors" );
} );