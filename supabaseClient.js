const { createClient } = require('@supabase/supabase-js');
const ImageKit = require('imagekit');
require('dotenv').config();

const supabase = createClient(
   process.env.SUPABASE_URL,
   process.env.SUPABASE_KEY
);

const imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = { supabase, imagekit };
