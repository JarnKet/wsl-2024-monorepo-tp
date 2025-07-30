/**
 * Helper function to format product response
 * @param {Object} row - Database row object
 * @returns {Object} - Formatted product object
 */
function formatProductResponse(row) {
  return {
    name: {
      en: row.name_en,
      fr: row.name_fr
    },
    description: {
      en: row.description_en,
      fr: row.description_fr
    },
    gtin: row.gtin,
    brand: row.brand,
    countryOfOrigin: row.country_of_origin,
    weight: {
      gross: row.gross_weight,
      net: row.net_weight,
      unit: row.weight_unit
    },
    imagePath: row.image_path,
    isHidden: row.is_hidden,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    company: {
      id: row.company_id,
      companyName: row.company_name,
      companyAddress: row.address,
      companyTelephone: row.telephone,
      companyEmail: row.email,
      owner: {
        name: row.owner_name,
        mobileNumber: row.owner_mobile,
        email: row.owner_email
      },
      contact: {
        name: row.contact_name,
        mobileNumber: row.contact_mobile,
        email: row.contact_email
      },
      isActive: !row.is_deactivated
    }
  };
}

module.exports = {
  formatProductResponse
};
