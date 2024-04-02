const BrandeMysupabase = require("../../../BrandemySupabase")
const supabase = BrandeMysupabase


// Fetch user along with their favorite brands
async function fetchUserWithFavorites(email) {
  try {
      // Fetch user
      const { data: user, error: userError } = await supabase
          .from('user')
          .select('*')
          .eq('email', email)
          .single();

      if (userError) {
          throw userError.message;
      }

      const user_id = user.id;

      // Fetch favorite brands for the user
      const { data: favorites, error: favoritesError } = await supabase
          .from('favorites')
          .select('brands(*)')
          .eq('user_id', user_id);

      if (favoritesError) {
          throw favoritesError.message;
      }

      // Fetch voting data for the user
      const { data: votingData, error: votingError } = await supabase
          .from('voters')
          .select('*')
          .eq('user_id', user_id);

      if (votingError) {
          throw votingError.message;
      }

      // Group voting data by brand_id
      const votingDataByBrandId = votingData.reduce((accumulator, current) => {
          const brandId = current.brand_id;
          if (!accumulator[brandId]) {
              accumulator[brandId] = [];
          }
          accumulator[brandId].push(current);
          return accumulator;
      }, {});

      // Merge favorites and votingData based on brand_id
      const mergedData = favorites.map(favorite => {
          const brandId = favorite.brands.id;
          return {
              ...favorite,
              votingData: votingDataByBrandId[brandId] || []
          };
      });

      // Return user with merged data
      return { ...user, mergedData };
  } catch (error) {
      console.error('Error fetching user with favorites:', error);
      return null;
  }
}







module.exports = { fetchUserWithFavorites }