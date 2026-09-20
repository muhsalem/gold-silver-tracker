export type Country = {
  code: string;
  numericCode: string;
  currency: string;
  ar: string;
  en: string;
  muslim?: boolean;
  lat: number;
  lng: number;
};

export const COUNTRIES: Country[] = [
  {
    code: "AF",
    numericCode: "004",
    currency: "AFN",
    ar: "أفغانستان",
    en: "Afghanistan",
    muslim: true,
    lat: 33,
    lng: 65
  },
  {
    code: "AL",
    numericCode: "008",
    currency: "ALL",
    ar: "ألبانيا",
    en: "Albania",
    muslim: true,
    lat: 41,
    lng: 20
  },
  {
    code: "DZ",
    numericCode: "012",
    currency: "DZD",
    ar: "الجزائر",
    en: "Algeria",
    muslim: true,
    lat: 28,
    lng: 3
  },
  {
    code: "AZ",
    numericCode: "031",
    currency: "AZN",
    ar: "أذربيجان",
    en: "Azerbaijan",
    muslim: true,
    lat: 40.5,
    lng: 47.5
  },
  {
    code: "BH",
    numericCode: "048",
    currency: "BHD",
    ar: "البحرين",
    en: "Bahrain",
    muslim: true,
    lat: 26,
    lng: 50.55
  },
  {
    code: "BD",
    numericCode: "050",
    currency: "BDT",
    ar: "بنغلاديش",
    en: "Bangladesh",
    muslim: true,
    lat: 24,
    lng: 90
  },
  {
    code: "BN",
    numericCode: "096",
    currency: "BND",
    ar: "بروناي",
    en: "Brunei",
    muslim: true,
    lat: 4.5,
    lng: 114.66666666
  },
  {
    code: "BF",
    numericCode: "854",
    currency: "XOF",
    ar: "بوركينا فاسو",
    en: "Burkina Faso",
    muslim: true,
    lat: 13,
    lng: -2
  },
  {
    code: "TD",
    numericCode: "148",
    currency: "XAF",
    ar: "تشاد",
    en: "Chad",
    muslim: true,
    lat: 15,
    lng: 19
  },
  {
    code: "KM",
    numericCode: "174",
    currency: "KMF",
    ar: "جزر القمر",
    en: "Comoros",
    muslim: true,
    lat: -12.16666666,
    lng: 44.25
  },
  {
    code: "DJ",
    numericCode: "262",
    currency: "DJF",
    ar: "جيبوتي",
    en: "Djibouti",
    muslim: true,
    lat: 11.5,
    lng: 43
  },
  {
    code: "EG",
    numericCode: "818",
    currency: "EGP",
    ar: "مصر",
    en: "Egypt",
    muslim: true,
    lat: 27,
    lng: 30
  },
  {
    code: "GM",
    numericCode: "270",
    currency: "GMD",
    ar: "غامبيا",
    en: "Gambia",
    muslim: true,
    lat: 13.46666666,
    lng: -16.56666666
  },
  {
    code: "GN",
    numericCode: "324",
    currency: "GNF",
    ar: "غينيا",
    en: "Guinea",
    muslim: true,
    lat: 11,
    lng: -10
  },
  {
    code: "ID",
    numericCode: "360",
    currency: "IDR",
    ar: "إندونيسيا",
    en: "Indonesia",
    muslim: true,
    lat: -5,
    lng: 120
  },
  {
    code: "IR",
    numericCode: "364",
    currency: "IRR",
    ar: "إيران",
    en: "Iran",
    muslim: true,
    lat: 32,
    lng: 53
  },
  {
    code: "IQ",
    numericCode: "368",
    currency: "IQD",
    ar: "العراق",
    en: "Iraq",
    muslim: true,
    lat: 33,
    lng: 44
  },
  {
    code: "JO",
    numericCode: "400",
    currency: "JOD",
    ar: "الأردن",
    en: "Jordan",
    muslim: true,
    lat: 31,
    lng: 36
  },
  {
    code: "KZ",
    numericCode: "398",
    currency: "KZT",
    ar: "كازاخستان",
    en: "Kazakhstan",
    muslim: true,
    lat: 48,
    lng: 68
  },
  {
    code: "KW",
    numericCode: "414",
    currency: "KWD",
    ar: "الكويت",
    en: "Kuwait",
    muslim: true,
    lat: 29.5,
    lng: 45.75
  },
  {
    code: "KG",
    numericCode: "417",
    currency: "KGS",
    ar: "قيرغيزستان",
    en: "Kyrgyzstan",
    muslim: true,
    lat: 41,
    lng: 75
  },
  {
    code: "LB",
    numericCode: "422",
    currency: "LBP",
    ar: "لبنان",
    en: "Lebanon",
    muslim: true,
    lat: 33.83333333,
    lng: 35.83333333
  },
  {
    code: "LY",
    numericCode: "434",
    currency: "LYD",
    ar: "ليبيا",
    en: "Libya",
    muslim: true,
    lat: 25,
    lng: 17
  },
  {
    code: "MY",
    numericCode: "458",
    currency: "MYR",
    ar: "ماليزيا",
    en: "Malaysia",
    muslim: true,
    lat: 2.5,
    lng: 112.5
  },
  {
    code: "MV",
    numericCode: "462",
    currency: "MVR",
    ar: "المالديف",
    en: "Maldives",
    muslim: true,
    lat: 3.25,
    lng: 73
  },
  {
    code: "ML",
    numericCode: "466",
    currency: "XOF",
    ar: "مالي",
    en: "Mali",
    muslim: true,
    lat: 17,
    lng: -4
  },
  {
    code: "MR",
    numericCode: "478",
    currency: "MRU",
    ar: "موريتانيا",
    en: "Mauritania",
    muslim: true,
    lat: 20,
    lng: -12
  },
  {
    code: "MA",
    numericCode: "504",
    currency: "MAD",
    ar: "المغرب",
    en: "Morocco",
    muslim: true,
    lat: 32,
    lng: -5
  },
  {
    code: "NE",
    numericCode: "562",
    currency: "XOF",
    ar: "النيجر",
    en: "Niger",
    muslim: true,
    lat: 16,
    lng: 8
  },
  {
    code: "NG",
    numericCode: "566",
    currency: "NGN",
    ar: "نيجيريا",
    en: "Nigeria",
    muslim: true,
    lat: 10,
    lng: 8
  },
  {
    code: "OM",
    numericCode: "512",
    currency: "OMR",
    ar: "عمان",
    en: "Oman",
    muslim: true,
    lat: 21,
    lng: 57
  },
  {
    code: "PK",
    numericCode: "586",
    currency: "PKR",
    ar: "باكستان",
    en: "Pakistan",
    muslim: true,
    lat: 30,
    lng: 70
  },
  {
    code: "PS",
    numericCode: "275",
    currency: "EGP",
    ar: "فلسطين",
    en: "Palestine",
    muslim: true,
    lat: 31.9,
    lng: 35.2
  },
  {
    code: "QA",
    numericCode: "634",
    currency: "QAR",
    ar: "قطر",
    en: "Qatar",
    muslim: true,
    lat: 25.5,
    lng: 51.25
  },
  {
    code: "SA",
    numericCode: "682",
    currency: "SAR",
    ar: "السعودية",
    en: "Saudi Arabia",
    muslim: true,
    lat: 25,
    lng: 45
  },
  {
    code: "SN",
    numericCode: "686",
    currency: "XOF",
    ar: "السنغال",
    en: "Senegal",
    muslim: true,
    lat: 14,
    lng: -14
  },
  {
    code: "SL",
    numericCode: "694",
    currency: "SLL",
    ar: "سيراليون",
    en: "Sierra Leone",
    muslim: true,
    lat: 8.5,
    lng: -11.5
  },
  {
    code: "SO",
    numericCode: "706",
    currency: "SOS",
    ar: "الصومال",
    en: "Somalia",
    muslim: true,
    lat: 10,
    lng: 49
  },
  {
    code: "SD",
    numericCode: "729",
    currency: "SDG",
    ar: "السودان",
    en: "Sudan",
    muslim: true,
    lat: 15,
    lng: 30
  },
  {
    code: "SY",
    numericCode: "760",
    currency: "SYP",
    ar: "سوريا",
    en: "Syria",
    muslim: true,
    lat: 35,
    lng: 38
  },
  {
    code: "TJ",
    numericCode: "762",
    currency: "TJS",
    ar: "طاجيكستان",
    en: "Tajikistan",
    muslim: true,
    lat: 39,
    lng: 71
  },
  {
    code: "TN",
    numericCode: "788",
    currency: "TND",
    ar: "تونس",
    en: "Tunisia",
    muslim: true,
    lat: 34,
    lng: 9
  },
  {
    code: "TR",
    numericCode: "792",
    currency: "TRY",
    ar: "تركيا",
    en: "Türkiye",
    muslim: true,
    lat: 39,
    lng: 35
  },
  {
    code: "TM",
    numericCode: "795",
    currency: "TMT",
    ar: "تركمانستان",
    en: "Turkmenistan",
    muslim: true,
    lat: 40,
    lng: 60
  },
  {
    code: "AE",
    numericCode: "784",
    currency: "AED",
    ar: "الإمارات",
    en: "United Arab Emirates",
    muslim: true,
    lat: 24,
    lng: 54
  },
  {
    code: "UZ",
    numericCode: "860",
    currency: "UZS",
    ar: "أوزباكستان",
    en: "Uzbekistan",
    muslim: true,
    lat: 41,
    lng: 64
  },
  {
    code: "YE",
    numericCode: "887",
    currency: "YER",
    ar: "اليمن",
    en: "Yemen",
    muslim: true,
    lat: 15,
    lng: 48
  },
  {
    code: "AD",
    numericCode: "020",
    currency: "EUR",
    ar: "أندورا",
    en: "Andorra",
    lat: 42.5,
    lng: 1.5
  },
  {
    code: "AO",
    numericCode: "024",
    currency: "AOA",
    ar: "جمهورية أنغولا",
    en: "Angola",
    lat: -12.5,
    lng: 18.5
  },
  {
    code: "AG",
    numericCode: "028",
    currency: "XCD",
    ar: "أنتيغوا وباربودا",
    en: "Antigua and Barbuda",
    lat: 17.05,
    lng: -61.8
  },
  {
    code: "AR",
    numericCode: "032",
    currency: "ARS",
    ar: "الأرجنتين",
    en: "Argentina",
    lat: -34,
    lng: -64
  },
  {
    code: "AM",
    numericCode: "051",
    currency: "AMD",
    ar: "أرمينيا",
    en: "Armenia",
    lat: 40,
    lng: 45
  },
  {
    code: "AU",
    numericCode: "036",
    currency: "AUD",
    ar: "أستراليا",
    en: "Australia",
    lat: -27,
    lng: 133
  },
  {
    code: "AT",
    numericCode: "040",
    currency: "EUR",
    ar: "النمسا",
    en: "Austria",
    lat: 47.33333333,
    lng: 13.33333333
  },
  {
    code: "BS",
    numericCode: "044",
    currency: "BSD",
    ar: "البهاما",
    en: "Bahamas",
    lat: 24.25,
    lng: -76
  },
  {
    code: "BB",
    numericCode: "052",
    currency: "BBD",
    ar: "باربادوس",
    en: "Barbados",
    lat: 13.16666666,
    lng: -59.53333333
  },
  {
    code: "BY",
    numericCode: "112",
    currency: "BYN",
    ar: "بيلاروسيا",
    en: "Belarus",
    lat: 53,
    lng: 28
  },
  {
    code: "BE",
    numericCode: "056",
    currency: "EUR",
    ar: "بلجيكا",
    en: "Belgium",
    lat: 50.83333333,
    lng: 4
  },
  {
    code: "BZ",
    numericCode: "084",
    currency: "BZD",
    ar: "بليز",
    en: "Belize",
    lat: 17.25,
    lng: -88.75
  },
  {
    code: "BJ",
    numericCode: "204",
    currency: "XOF",
    ar: "بنين",
    en: "Benin",
    lat: 9.5,
    lng: 2.25
  },
  {
    code: "BT",
    numericCode: "064",
    currency: "BTN",
    ar: "بوتان",
    en: "Bhutan",
    lat: 27.5,
    lng: 90.5
  },
  {
    code: "BO",
    numericCode: "068",
    currency: "BOB",
    ar: "بوليفيا",
    en: "Bolivia",
    lat: -17,
    lng: -65
  },
  {
    code: "BA",
    numericCode: "070",
    currency: "BAM",
    ar: "البوسنة والهرسك",
    en: "Bosnia and Herzegovina",
    lat: 44,
    lng: 18
  },
  {
    code: "BW",
    numericCode: "072",
    currency: "BWP",
    ar: "بوتسوانا",
    en: "Botswana",
    lat: -22,
    lng: 24
  },
  {
    code: "BR",
    numericCode: "076",
    currency: "BRL",
    ar: "البرازيل",
    en: "Brazil",
    lat: -10,
    lng: -55
  },
  {
    code: "BG",
    numericCode: "100",
    currency: "BGN",
    ar: "بلغاريا",
    en: "Bulgaria",
    lat: 43,
    lng: 25
  },
  {
    code: "BI",
    numericCode: "108",
    currency: "BIF",
    ar: "بوروندي",
    en: "Burundi",
    lat: -3.5,
    lng: 30
  },
  {
    code: "KH",
    numericCode: "116",
    currency: "KHR",
    ar: "كمبوديا",
    en: "Cambodia",
    lat: 13,
    lng: 105
  },
  {
    code: "CM",
    numericCode: "120",
    currency: "XAF",
    ar: "الكاميرون",
    en: "Cameroon",
    lat: 6,
    lng: 12
  },
  {
    code: "CA",
    numericCode: "124",
    currency: "CAD",
    ar: "كندا",
    en: "Canada",
    lat: 60,
    lng: -95
  },
  {
    code: "CV",
    numericCode: "132",
    currency: "CVE",
    ar: "كابو فيردي",
    en: "Cape Verde",
    lat: 16,
    lng: -24
  },
  {
    code: "CF",
    numericCode: "140",
    currency: "XAF",
    ar: "جمهورية أفريقيا الوسطى",
    en: "Central African Republic",
    lat: 7,
    lng: 21
  },
  {
    code: "CL",
    numericCode: "152",
    currency: "CLP",
    ar: "تشيلي",
    en: "Chile",
    lat: -30,
    lng: -71
  },
  {
    code: "CN",
    numericCode: "156",
    currency: "CNY",
    ar: "الصين",
    en: "China",
    lat: 35,
    lng: 105
  },
  {
    code: "CO",
    numericCode: "170",
    currency: "COP",
    ar: "كولومبيا",
    en: "Colombia",
    lat: 4,
    lng: -72
  },
  {
    code: "CR",
    numericCode: "188",
    currency: "CRC",
    ar: "كوستاريكا",
    en: "Costa Rica",
    lat: 10,
    lng: -84
  },
  {
    code: "HR",
    numericCode: "191",
    currency: "EUR",
    ar: "كرواتيا",
    en: "Croatia",
    lat: 45.16666666,
    lng: 15.5
  },
  {
    code: "CU",
    numericCode: "192",
    currency: "CUC",
    ar: "كوبا",
    en: "Cuba",
    lat: 21.5,
    lng: -80
  },
  {
    code: "CY",
    numericCode: "196",
    currency: "EUR",
    ar: "قبرص",
    en: "Cyprus",
    lat: 35,
    lng: 33
  },
  {
    code: "CZ",
    numericCode: "203",
    currency: "CZK",
    ar: "التشيك",
    en: "Czechia",
    lat: 49.75,
    lng: 15.5
  },
  {
    code: "DK",
    numericCode: "208",
    currency: "DKK",
    ar: "الدنمارك",
    en: "Denmark",
    lat: 56,
    lng: 10
  },
  {
    code: "DM",
    numericCode: "212",
    currency: "XCD",
    ar: "دومينيكا",
    en: "Dominica",
    lat: 15.41666666,
    lng: -61.33333333
  },
  {
    code: "DO",
    numericCode: "214",
    currency: "DOP",
    ar: "جمهورية الدومينيكان",
    en: "Dominican Republic",
    lat: 19,
    lng: -70.66666666
  },
  {
    code: "CD",
    numericCode: "180",
    currency: "CDF",
    ar: "الكونغو",
    en: "DR Congo",
    lat: 0,
    lng: 25
  },
  {
    code: "EC",
    numericCode: "218",
    currency: "USD",
    ar: "الإكوادور",
    en: "Ecuador",
    lat: -2,
    lng: -77.5
  },
  {
    code: "SV",
    numericCode: "222",
    currency: "USD",
    ar: "السلفادور",
    en: "El Salvador",
    lat: 13.83333333,
    lng: -88.91666666
  },
  {
    code: "GQ",
    numericCode: "226",
    currency: "XAF",
    ar: "غينيا الاستوائية",
    en: "Equatorial Guinea",
    lat: 2,
    lng: 10
  },
  {
    code: "ER",
    numericCode: "232",
    currency: "ERN",
    ar: "إريتريا",
    en: "Eritrea",
    lat: 15,
    lng: 39
  },
  {
    code: "EE",
    numericCode: "233",
    currency: "EUR",
    ar: "إستونيا",
    en: "Estonia",
    lat: 59,
    lng: 26
  },
  {
    code: "SZ",
    numericCode: "748",
    currency: "SZL",
    ar: "إسواتيني",
    en: "Eswatini",
    lat: -26.5,
    lng: 31.5
  },
  {
    code: "ET",
    numericCode: "231",
    currency: "ETB",
    ar: "إثيوبيا",
    en: "Ethiopia",
    lat: 8,
    lng: 38
  },
  {
    code: "FJ",
    numericCode: "242",
    currency: "FJD",
    ar: "فيجي",
    en: "Fiji",
    lat: -18,
    lng: 175
  },
  {
    code: "FI",
    numericCode: "246",
    currency: "EUR",
    ar: "فنلندا",
    en: "Finland",
    lat: 64,
    lng: 26
  },
  {
    code: "FR",
    numericCode: "250",
    currency: "EUR",
    ar: "فرنسا",
    en: "France",
    lat: 46,
    lng: 2
  },
  {
    code: "GA",
    numericCode: "266",
    currency: "XAF",
    ar: "الغابون",
    en: "Gabon",
    lat: -1,
    lng: 11.75
  },
  {
    code: "GE",
    numericCode: "268",
    currency: "GEL",
    ar: "جورجيا",
    en: "Georgia",
    lat: 42,
    lng: 43.5
  },
  {
    code: "DE",
    numericCode: "276",
    currency: "EUR",
    ar: "ألمانيا",
    en: "Germany",
    lat: 51,
    lng: 9
  },
  {
    code: "GH",
    numericCode: "288",
    currency: "GHS",
    ar: "غانا",
    en: "Ghana",
    lat: 8,
    lng: -2
  },
  {
    code: "GR",
    numericCode: "300",
    currency: "EUR",
    ar: "اليونان",
    en: "Greece",
    lat: 39,
    lng: 22
  },
  {
    code: "GD",
    numericCode: "308",
    currency: "XCD",
    ar: "غرينادا",
    en: "Grenada",
    lat: 12.11666666,
    lng: -61.66666666
  },
  {
    code: "GT",
    numericCode: "320",
    currency: "GTQ",
    ar: "غواتيمالا",
    en: "Guatemala",
    lat: 15.5,
    lng: -90.25
  },
  {
    code: "GW",
    numericCode: "624",
    currency: "XOF",
    ar: "غينيا بيساو",
    en: "Guinea-Bissau",
    lat: 12,
    lng: -15
  },
  {
    code: "GY",
    numericCode: "328",
    currency: "GYD",
    ar: "غيانا",
    en: "Guyana",
    lat: 5,
    lng: -59
  },
  {
    code: "HT",
    numericCode: "332",
    currency: "HTG",
    ar: "هايتي",
    en: "Haiti",
    lat: 19,
    lng: -72.41666666
  },
  {
    code: "HN",
    numericCode: "340",
    currency: "HNL",
    ar: "هندوراس",
    en: "Honduras",
    lat: 15,
    lng: -86.5
  },
  {
    code: "HU",
    numericCode: "348",
    currency: "HUF",
    ar: "المجر",
    en: "Hungary",
    lat: 47,
    lng: 20
  },
  {
    code: "IS",
    numericCode: "352",
    currency: "ISK",
    ar: "آيسلندا",
    en: "Iceland",
    lat: 65,
    lng: -18
  },
  {
    code: "IN",
    numericCode: "356",
    currency: "INR",
    ar: "الهند",
    en: "India",
    lat: 20,
    lng: 77
  },
  {
    code: "IE",
    numericCode: "372",
    currency: "EUR",
    ar: "أيرلندا",
    en: "Ireland",
    lat: 53,
    lng: -8
  },
  {
    code: "IL",
    numericCode: "376",
    currency: "ILS",
    ar: "إسرائيل",
    en: "Israel",
    lat: 31.47,
    lng: 35.13
  },
  {
    code: "IT",
    numericCode: "380",
    currency: "EUR",
    ar: "إيطاليا",
    en: "Italy",
    lat: 42.83333333,
    lng: 12.83333333
  },
  {
    code: "CI",
    numericCode: "384",
    currency: "XOF",
    ar: "ساحل العاج",
    en: "Ivory Coast",
    lat: 8,
    lng: -5
  },
  {
    code: "JM",
    numericCode: "388",
    currency: "JMD",
    ar: "جامايكا",
    en: "Jamaica",
    lat: 18.25,
    lng: -77.5
  },
  {
    code: "JP",
    numericCode: "392",
    currency: "JPY",
    ar: "اليابان",
    en: "Japan",
    lat: 36,
    lng: 138
  },
  {
    code: "KE",
    numericCode: "404",
    currency: "KES",
    ar: "كينيا",
    en: "Kenya",
    lat: 1,
    lng: 38
  },
  {
    code: "KI",
    numericCode: "296",
    currency: "AUD",
    ar: "كيريباتي",
    en: "Kiribati",
    lat: 1.41666666,
    lng: 173
  },
  {
    code: "LA",
    numericCode: "418",
    currency: "LAK",
    ar: "لاوس",
    en: "Laos",
    lat: 18,
    lng: 105
  },
  {
    code: "LV",
    numericCode: "428",
    currency: "EUR",
    ar: "لاتفيا",
    en: "Latvia",
    lat: 57,
    lng: 25
  },
  {
    code: "LS",
    numericCode: "426",
    currency: "LSL",
    ar: "ليسوتو",
    en: "Lesotho",
    lat: -29.5,
    lng: 28.5
  },
  {
    code: "LR",
    numericCode: "430",
    currency: "LRD",
    ar: "ليبيريا",
    en: "Liberia",
    lat: 6.5,
    lng: -9.5
  },
  {
    code: "LI",
    numericCode: "438",
    currency: "CHF",
    ar: "ليختنشتاين",
    en: "Liechtenstein",
    lat: 47.26666666,
    lng: 9.53333333
  },
  {
    code: "LT",
    numericCode: "440",
    currency: "EUR",
    ar: "ليتوانيا",
    en: "Lithuania",
    lat: 56,
    lng: 24
  },
  {
    code: "LU",
    numericCode: "442",
    currency: "EUR",
    ar: "لوكسمبورغ",
    en: "Luxembourg",
    lat: 49.75,
    lng: 6.16666666
  },
  {
    code: "MG",
    numericCode: "450",
    currency: "MGA",
    ar: "مدغشقر",
    en: "Madagascar",
    lat: -20,
    lng: 47
  },
  {
    code: "MW",
    numericCode: "454",
    currency: "MWK",
    ar: "مالاوي",
    en: "Malawi",
    lat: -13.5,
    lng: 34
  },
  {
    code: "MT",
    numericCode: "470",
    currency: "EUR",
    ar: "مالطا",
    en: "Malta",
    lat: 35.83333333,
    lng: 14.58333333
  },
  {
    code: "MH",
    numericCode: "584",
    currency: "USD",
    ar: "جزر مارشال",
    en: "Marshall Islands",
    lat: 9,
    lng: 168
  },
  {
    code: "MU",
    numericCode: "480",
    currency: "MUR",
    ar: "موريشيوس",
    en: "Mauritius",
    lat: -20.28333333,
    lng: 57.55
  },
  {
    code: "MX",
    numericCode: "484",
    currency: "MXN",
    ar: "المسكيك",
    en: "Mexico",
    lat: 23,
    lng: -102
  },
  {
    code: "FM",
    numericCode: "583",
    currency: "USD",
    ar: "ميكرونيسيا",
    en: "Micronesia",
    lat: 6.91666666,
    lng: 158.25
  },
  {
    code: "MD",
    numericCode: "498",
    currency: "MDL",
    ar: "مولدوڤا",
    en: "Moldova",
    lat: 47,
    lng: 29
  },
  {
    code: "MC",
    numericCode: "492",
    currency: "EUR",
    ar: "موناكو",
    en: "Monaco",
    lat: 43.73333333,
    lng: 7.4
  },
  {
    code: "MN",
    numericCode: "496",
    currency: "MNT",
    ar: "منغوليا",
    en: "Mongolia",
    lat: 46,
    lng: 105
  },
  {
    code: "ME",
    numericCode: "499",
    currency: "EUR",
    ar: "الجبل الاسود",
    en: "Montenegro",
    lat: 42.5,
    lng: 19.3
  },
  {
    code: "MZ",
    numericCode: "508",
    currency: "MZN",
    ar: "موزمبيق",
    en: "Mozambique",
    lat: -18.25,
    lng: 35
  },
  {
    code: "MM",
    numericCode: "104",
    currency: "MMK",
    ar: "ميانمار",
    en: "Myanmar",
    lat: 22,
    lng: 98
  },
  {
    code: "NA",
    numericCode: "516",
    currency: "NAD",
    ar: "ناميبيا",
    en: "Namibia",
    lat: -22,
    lng: 17
  },
  {
    code: "NR",
    numericCode: "520",
    currency: "AUD",
    ar: "ناورو",
    en: "Nauru",
    lat: -0.53333333,
    lng: 166.91666666
  },
  {
    code: "NP",
    numericCode: "524",
    currency: "NPR",
    ar: "نيبال",
    en: "Nepal",
    lat: 28,
    lng: 84
  },
  {
    code: "NL",
    numericCode: "528",
    currency: "EUR",
    ar: "هولندا",
    en: "Netherlands",
    lat: 52.5,
    lng: 5.75
  },
  {
    code: "NZ",
    numericCode: "554",
    currency: "NZD",
    ar: "نيوزيلندا",
    en: "New Zealand",
    lat: -41,
    lng: 174
  },
  {
    code: "NI",
    numericCode: "558",
    currency: "NIO",
    ar: "نيكاراغوا",
    en: "Nicaragua",
    lat: 13,
    lng: -85
  },
  {
    code: "KP",
    numericCode: "408",
    currency: "KPW",
    ar: "كوريا الشمالية",
    en: "North Korea",
    lat: 40,
    lng: 127
  },
  {
    code: "MK",
    numericCode: "807",
    currency: "MKD",
    ar: "شمال مقدونيا",
    en: "North Macedonia",
    lat: 41.83333333,
    lng: 22
  },
  {
    code: "NO",
    numericCode: "578",
    currency: "NOK",
    ar: "النرويج",
    en: "Norway",
    lat: 62,
    lng: 10
  },
  {
    code: "PW",
    numericCode: "585",
    currency: "USD",
    ar: "بالاو",
    en: "Palau",
    lat: 7.5,
    lng: 134.5
  },
  {
    code: "PA",
    numericCode: "591",
    currency: "PAB",
    ar: "بنما",
    en: "Panama",
    lat: 9,
    lng: -80
  },
  {
    code: "PG",
    numericCode: "598",
    currency: "PGK",
    ar: "بابوا غينيا الجديدة",
    en: "Papua New Guinea",
    lat: -6,
    lng: 147
  },
  {
    code: "PY",
    numericCode: "600",
    currency: "PYG",
    ar: "باراغواي",
    en: "Paraguay",
    lat: -23,
    lng: -58
  },
  {
    code: "PE",
    numericCode: "604",
    currency: "PEN",
    ar: "بيرو",
    en: "Peru",
    lat: -10,
    lng: -76
  },
  {
    code: "PH",
    numericCode: "608",
    currency: "PHP",
    ar: "الفلبين",
    en: "Philippines",
    lat: 13,
    lng: 122
  },
  {
    code: "PL",
    numericCode: "616",
    currency: "PLN",
    ar: "بولندا",
    en: "Poland",
    lat: 52,
    lng: 20
  },
  {
    code: "PT",
    numericCode: "620",
    currency: "EUR",
    ar: "البرتغال",
    en: "Portugal",
    lat: 39.5,
    lng: -8
  },
  {
    code: "CG",
    numericCode: "178",
    currency: "XAF",
    ar: "جمهورية الكونغو",
    en: "Republic of the Congo",
    lat: -1,
    lng: 15
  },
  {
    code: "RO",
    numericCode: "642",
    currency: "RON",
    ar: "رومانيا",
    en: "Romania",
    lat: 46,
    lng: 25
  },
  {
    code: "RU",
    numericCode: "643",
    currency: "RUB",
    ar: "روسيا",
    en: "Russia",
    lat: 60,
    lng: 100
  },
  {
    code: "RW",
    numericCode: "646",
    currency: "RWF",
    ar: "رواندا",
    en: "Rwanda",
    lat: -2,
    lng: 30
  },
  {
    code: "KN",
    numericCode: "659",
    currency: "XCD",
    ar: "سانت كيتس ونيفيس",
    en: "Saint Kitts and Nevis",
    lat: 17.33333333,
    lng: -62.75
  },
  {
    code: "LC",
    numericCode: "662",
    currency: "XCD",
    ar: "سانت لوسيا",
    en: "Saint Lucia",
    lat: 13.88333333,
    lng: -60.96666666
  },
  {
    code: "VC",
    numericCode: "670",
    currency: "XCD",
    ar: "سانت فينسنت والغرينادين",
    en: "Saint Vincent and the Grenadines",
    lat: 13.25,
    lng: -61.2
  },
  {
    code: "WS",
    numericCode: "882",
    currency: "WST",
    ar: "ساموا",
    en: "Samoa",
    lat: -13.58333333,
    lng: -172.33333333
  },
  {
    code: "SM",
    numericCode: "674",
    currency: "EUR",
    ar: "سان مارينو",
    en: "San Marino",
    lat: 43.76666666,
    lng: 12.41666666
  },
  {
    code: "ST",
    numericCode: "678",
    currency: "STN",
    ar: "ساو تومي وبرينسيب",
    en: "São Tomé and Príncipe",
    lat: 1,
    lng: 7
  },
  {
    code: "RS",
    numericCode: "688",
    currency: "RSD",
    ar: "صيربيا",
    en: "Serbia",
    lat: 44,
    lng: 21
  },
  {
    code: "SC",
    numericCode: "690",
    currency: "SCR",
    ar: "سيشل",
    en: "Seychelles",
    lat: -4.58333333,
    lng: 55.66666666
  },
  {
    code: "SG",
    numericCode: "702",
    currency: "SGD",
    ar: "سنغافورة",
    en: "Singapore",
    lat: 1.36666666,
    lng: 103.8
  },
  {
    code: "SK",
    numericCode: "703",
    currency: "EUR",
    ar: "سلوفاكيا",
    en: "Slovakia",
    lat: 48.66666666,
    lng: 19.5
  },
  {
    code: "SI",
    numericCode: "705",
    currency: "EUR",
    ar: "سلوفينيا",
    en: "Slovenia",
    lat: 46.11666666,
    lng: 14.81666666
  },
  {
    code: "SB",
    numericCode: "090",
    currency: "SBD",
    ar: "جزر سليمان",
    en: "Solomon Islands",
    lat: -8,
    lng: 159
  },
  {
    code: "ZA",
    numericCode: "710",
    currency: "ZAR",
    ar: "جنوب أفريقيا",
    en: "South Africa",
    lat: -29,
    lng: 24
  },
  {
    code: "KR",
    numericCode: "410",
    currency: "KRW",
    ar: "كوريا الجنوبية",
    en: "South Korea",
    lat: 37,
    lng: 127.5
  },
  {
    code: "SS",
    numericCode: "728",
    currency: "SSP",
    ar: "جنوب السودان",
    en: "South Sudan",
    lat: 7,
    lng: 30
  },
  {
    code: "ES",
    numericCode: "724",
    currency: "EUR",
    ar: "إسبانيا",
    en: "Spain",
    lat: 40,
    lng: -4
  },
  {
    code: "LK",
    numericCode: "144",
    currency: "LKR",
    ar: "سريلانكا",
    en: "Sri Lanka",
    lat: 7,
    lng: 81
  },
  {
    code: "SR",
    numericCode: "740",
    currency: "SRD",
    ar: "سورينام",
    en: "Suriname",
    lat: 4,
    lng: -56
  },
  {
    code: "SE",
    numericCode: "752",
    currency: "SEK",
    ar: "السويد",
    en: "Sweden",
    lat: 62,
    lng: 15
  },
  {
    code: "CH",
    numericCode: "756",
    currency: "CHF",
    ar: "سويسرا",
    en: "Switzerland",
    lat: 47,
    lng: 8
  },
  {
    code: "TZ",
    numericCode: "834",
    currency: "TZS",
    ar: "تنزانيا",
    en: "Tanzania",
    lat: -6,
    lng: 35
  },
  {
    code: "TH",
    numericCode: "764",
    currency: "THB",
    ar: "تايلند",
    en: "Thailand",
    lat: 15,
    lng: 100
  },
  {
    code: "TL",
    numericCode: "626",
    currency: "USD",
    ar: "تيمور الشرقية",
    en: "Timor-Leste",
    lat: -8.83333333,
    lng: 125.91666666
  },
  {
    code: "TG",
    numericCode: "768",
    currency: "XOF",
    ar: "توغو",
    en: "Togo",
    lat: 8,
    lng: 1.16666666
  },
  {
    code: "TO",
    numericCode: "776",
    currency: "TOP",
    ar: "تونغا",
    en: "Tonga",
    lat: -20,
    lng: -175
  },
  {
    code: "TT",
    numericCode: "780",
    currency: "TTD",
    ar: "ترينيداد وتوباغو",
    en: "Trinidad and Tobago",
    lat: 11,
    lng: -61
  },
  {
    code: "TV",
    numericCode: "798",
    currency: "AUD",
    ar: "توفالو",
    en: "Tuvalu",
    lat: -8,
    lng: 178
  },
  {
    code: "UG",
    numericCode: "800",
    currency: "UGX",
    ar: "أوغندا",
    en: "Uganda",
    lat: 1,
    lng: 32
  },
  {
    code: "UA",
    numericCode: "804",
    currency: "UAH",
    ar: "أوكرانيا",
    en: "Ukraine",
    lat: 49,
    lng: 32
  },
  {
    code: "GB",
    numericCode: "826",
    currency: "GBP",
    ar: "المملكة المتحدة",
    en: "United Kingdom",
    lat: 54,
    lng: -2
  },
  {
    code: "US",
    numericCode: "840",
    currency: "USD",
    ar: "الولايات المتحدة",
    en: "United States",
    lat: 38,
    lng: -97
  },
  {
    code: "UY",
    numericCode: "858",
    currency: "UYU",
    ar: "الأوروغواي",
    en: "Uruguay",
    lat: -33,
    lng: -56
  },
  {
    code: "VU",
    numericCode: "548",
    currency: "VUV",
    ar: "فانواتو",
    en: "Vanuatu",
    lat: -16,
    lng: 167
  },
  {
    code: "VA",
    numericCode: "336",
    currency: "EUR",
    ar: "مدينة الفاتيكان",
    en: "Vatican City",
    lat: 41.9,
    lng: 12.45
  },
  {
    code: "VE",
    numericCode: "862",
    currency: "VES",
    ar: "فنزويلا",
    en: "Venezuela",
    lat: 8,
    lng: -66
  },
  {
    code: "VN",
    numericCode: "704",
    currency: "VND",
    ar: "فيتنام",
    en: "Vietnam",
    lat: 16.16666666,
    lng: 107.83333333
  },
  {
    code: "ZM",
    numericCode: "894",
    currency: "ZMW",
    ar: "زامبيا",
    en: "Zambia",
    lat: -15,
    lng: 30
  },
  {
    code: "ZW",
    numericCode: "716",
    currency: "BWP",
    ar: "زيمبابوي",
    en: "Zimbabwe",
    lat: -20,
    lng: 30
  }
];

export const DEFAULT_COUNTRY = "SA";

const FALLBACK_COUNTRY: Country = {
  code: "SA",
  numericCode: "682",
  currency: "SAR",
  ar: "السعودية",
  en: "Saudi Arabia",
  muslim: true,
  lat: 24,
  lng: 45,
};

export function findCountry(code: string): Country {
  return (
    COUNTRIES.find((c) => c.code === code) ??
    COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY) ??
    COUNTRIES[0] ??
    FALLBACK_COUNTRY
  );
}

export function flagOf(code: string): string {
  return code.toUpperCase().split("").map((ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65)).join("");
}

export function countryName(country: Country, locale: string): string {
  if (locale.startsWith("ar")) return country.ar;
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return dn.of(country.code) ?? country.en;
  } catch { return country.en; }
}
