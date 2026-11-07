# Visa Country Data Sources & Verification Report

*Date checked: October 30, 2026*  
*Status: Internal Reference Document (Draft Only, Not Served Publicly)*

> **Important Note:** Consular fees, processing durations, and entry regulations are subject to frequent diplomatic and statutory revisions. All country entries in `visa-countries.draft.json` are maintained as **Drafts**. The agency owner must review each country, verify latest consular notices, set the agency's own service fees, and publish the records manually from the admin panel.

---

## Owner must set service fee before publishing

The `serviceFee` has been initialized to `0` across all fee rows in accordance with agency policy. Before publishing any country, the owner must set their respective service fee:

| Country | Visa Type | Embassy Fee | Current Service Fee | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **United Arab Emirates** | Tourist Visa (30 Days Single Entry) | 250 AED | 0 AED | Set agency service fee |
| **United Arab Emirates** | Tourist Visa (60 Days Single Entry) | 350 AED | 0 AED | Set agency service fee |
| **Thailand** | Tourist Visa (Single Entry - TR) | 40 USD | 0 USD | Set agency service fee |
| **Singapore** | Entry Visa (Form 14A) | 1,900 INR | 0 INR | Set agency service fee |
| **Indonesia** | Electronic Visa on Arrival (e-VOA / B213) | 35 USD | 0 USD | Set agency service fee |
| **Vietnam** | Electronic Visa (Single Entry, up to 90 Days) | 25 USD | 0 USD | Set agency service fee |
| **Vietnam** | Electronic Visa (Multiple Entry, up to 90 Days) | 50 USD | 0 USD | Set agency service fee |
| **Cambodia** | Tourist e-Visa (Type T) | 36 USD | 0 USD | Set agency service fee |
| **Philippines** | Temporary Visitor Visa (9A Single Entry) | 40 USD | 0 USD | Set agency service fee |
| **Sri Lanka** | Tourist Electronic Travel Authorization (ETA) | 50 USD | 0 USD | Set agency service fee |
| **Nepal** | Entry for Indian Citizens | 0 INR | 0 INR | Set agency service fee |
| **Bhutan** | Sustainable Development Fee (per night) | 1,200 INR | 0 INR | Set agency service fee |
| **Maldives** | Tourist Visa on Arrival (30 Days) | 0 USD | 0 USD | Set agency service fee |
| **Mauritius** | Tourist Visa on Arrival (up to 60 days) | 0 INR | 0 INR | Set agency service fee |
| **Seychelles** | Electronic Travel Authorization (eTA) | 10 EUR | 0 EUR | Set agency service fee |
| **Turkey** | Electronic Visa (e-Visa - conditional) | 43 USD | 0 USD | Set agency service fee |
| **Egypt** | Tourist e-Visa (Single Entry, 30 Days) | 25 USD | 0 USD | Set agency service fee |
| **Egypt** | Tourist e-Visa (Multiple Entry, 90 Days) | 60 USD | 0 USD | Set agency service fee |
| **Azerbaijan** | Standard ASAN e-Visa (3 Working Days) | 26 USD | 0 USD | Set agency service fee |
| **Azerbaijan** | Urgent ASAN e-Visa (3 Hours) | 61 USD | 0 USD | Set agency service fee |
| **Georgia** | Short-Stay e-Visa (Ordinary) | 20 USD | 0 USD | Set agency service fee |
| **Armenia** | Visitor e-Visa (Short Stay - Up to 21 Days) | 6 USD | 0 USD | Set agency service fee |
| **Armenia** | Visitor e-Visa (Long Stay - Up to 120 Days) | 31 USD | 0 USD | Set agency service fee |
| **Kazakhstan** | Visa-Free Entry (Up to 14 Days) | 0 USD | 0 USD | Set agency service fee |
| **Uzbekistan** | Electronic Tourist Visa (Single Entry) | 20 USD | 0 USD | Set agency service fee |
| **Uzbekistan** | Electronic Tourist Visa (Double Entry) | 35 USD | 0 USD | Set agency service fee |
| **Uzbekistan** | Electronic Tourist Visa (Multiple Entry) | 50 USD | 0 USD | Set agency service fee |
| **Qatar** | Visa Waiver on Arrival (30 Days) | 0 INR | 0 INR | Set agency service fee |
| **Jordan** | Single Entry Tourist Visa (1 Month) | 56 USD | 0 USD | Set agency service fee |
| **Schengen Area** | Schengen Short-Stay Visa (Type C - Adult) | 90 EUR | 0 EUR | Set agency service fee |
| **Schengen Area** | Schengen Short-Stay Visa (Child 6–12 Years) | 45 EUR | 0 EUR | Set agency service fee |
| **United Kingdom** | Standard Visitor Visa (6 Months) | 145 USD | 0 USD | Set agency service fee |
| **Ireland** | Short Stay 'C' Visa (Single Journey) | 60 EUR | 0 EUR | Set agency service fee |
| **Ireland** | Short Stay 'C' Visa (Multi Journey) | 100 EUR | 0 EUR | Set agency service fee |
| **USA** | Non-Immigrant Visitor Visa (B1/B2 MRV Fee) | 185 USD | 0 USD | Set agency service fee |
| **Canada** | Temporary Resident Visa (Visitor Visa) | 75 USD | 0 USD | Set agency service fee |
| **Canada** | Biometrics Fee (Individual) | 65 USD | 0 USD | Set agency service fee |
| **Australia** | Visitor Visa (Subclass 600 - Tourist Stream) | 125 USD | 0 USD | Set agency service fee |
| **New Zealand** | Visitor Visa + International Visitor Levy (IVL) | 190 USD | 0 USD | Set agency service fee |
| **Japan** | Single Entry Tourist Visa | 1,700 INR | 0 INR | Set agency service fee |
| **South Korea** | Short-Term Tourist Visa (C-3-9 Single Entry) | 40 USD | 0 USD | Set agency service fee |
| **Hong Kong** | Pre-arrival Registration (PAR) | 0 INR | 0 INR | Set agency service fee |
| **China** | Tourist Visa (L - Single Entry) | 2,400 INR | 0 INR | Set agency service fee |
| **South Africa** | Visitor's Visa (Section 11(1)) | 0 INR | 0 INR | Set agency service fee |
| **Kenya** | Electronic Travel Authorisation (eTA) | 32.50 USD | 0 USD | Set agency service fee |
| **Tanzania** | Ordinary Tourist Visa (Single Entry) | 50 USD | 0 USD | Set agency service fee |
| **Russia** | Unified Electronic Visa (e-Visa) | 52 USD | 0 USD | Set agency service fee |

---

## Country-by-Country Official Source Breakdown

### 1. United Arab Emirates (UAE)
- **Official Source:** Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) — `https://smartservices.icp.gov.ae` and General Directorate of Residency and Foreigners Affairs (GDRFA Dubai) — `https://gdrfad.gov.ae`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Official ICP tourist e-visa fees are 250 AED (30 days) and 350 AED (60 days) + issuing fees.

### 2. Thailand
- **Official Source:** Official Thai e-Visa Portal — `https://thaievisa.go.th` and Royal Thai Embassy New Delhi — `https://newdelhi.thaiembassy.org`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Periodic unilateral visa exemption orders are announced by the cabinet and should be verified prior to booking.

### 3. Singapore
- **Official Source:** Immigration & Checkpoints Authority (ICA) — `https://www.ica.gov.sg`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Standard entry visa processing fee is 30 SGD (~1,900 INR).

### 4. Malaysia
- **Official Source:** Official Immigration Department of Malaysia (eVISA / MDAC Portal) — `https://malaysiavisa.imi.gov.my`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** Exact fee charges left empty because Indian nationals currently enter under the 30-day visa-free facility.

### 5. Indonesia (Bali)
- **Official Source:** Directorate General of Immigration Indonesia (Molina / e-VOA) — `https://evisa.imigrasi.go.id`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. e-VOA is 500,000 IDR (~35 USD).

### 6. Vietnam
- **Official Source:** National Web Portal on Immigration, Vietnam Ministry of Public Security — `https://evisa.xuatnhapcanh.gov.vn`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 25 USD single entry, 50 USD multiple entry.

### 7. Cambodia
- **Official Source:** Ministry of Foreign Affairs and International Cooperation Cambodia — `https://www.evisa.gov.kh`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 30 USD visa fee + 6 USD processing fee = 36 USD.

### 8. Philippines
- **Official Source:** Department of Foreign Affairs Philippines — `https://evisa.gov.ph` and Embassy of the Philippines New Delhi — `https://newdelhipe.dfa.gov.ph`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Single entry 9(a) visa fee is 40 USD.

### 9. Sri Lanka
- **Official Source:** Department of Immigration and Emigration Sri Lanka (ETA System) — `https://www.eta.gov.lk`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Standard tourist ETA fee is 50 USD.

### 10. Nepal
- **Official Source:** Department of Immigration Nepal — `https://immigration.gov.np`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Indian passport or Voter ID holders require no visa (0 INR fee).

### 11. Bhutan
- **Official Source:** Department of Immigration, Royal Government of Bhutan — `https://www.doi.gov.bt` and Department of Tourism — `https://bhutan.travel`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Entry clearance is free; Sustainable Development Fee (SDF) of 1,200 INR per person per night is mandatory for Indian nationals.

### 12. Maldives
- **Official Source:** Maldives Immigration — `https://immigration.gov.mv`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 30-day tourist visa on arrival is free (0 USD).

### 13. Mauritius
- **Official Source:** Passport and Immigration Office, Mauritius Police Force — `https://passport.govmu.org`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Free visa on arrival up to 60 days for Indian citizens.

### 14. Seychelles
- **Official Source:** Department of Foreign Affairs Seychelles — `https://seychelles.govtas.com`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Seychelles is visa-free; official electronic Travel Authorization fee is 10 EUR.

### 15. Turkey (Türkiye)
- **Official Source:** Republic of Türkiye Electronic Visa Application System — `https://www.evisa.gov.tr`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** Sticker visa fee for applicants without qualifying supporting visas depends on authorized consular handling; conditional e-Visa fee is 43 USD.

### 16. Egypt
- **Official Source:** Arab Republic of Egypt Ministry of Interior (Egypt e-Visa Portal) — `https://visa2egypt.gov.eg`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Single entry 25 USD, Multiple entry 60 USD.

### 17. Azerbaijan
- **Official Source:** State Agency for Public Service and Social Innovations (ASAN Visa) — `https://evisa.gov.az`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 26 USD standard (3 days) / 61 USD urgent (3 hours).

### 18. Georgia
- **Official Source:** Consular Department of the Ministry of Foreign Affairs of Georgia — `https://www.evisa.gov.ge`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Official state duty is 20 USD.

### 19. Armenia
- **Official Source:** Ministry of Foreign Affairs of the Republic of Armenia — `https://evisa.mfa.am`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 6 USD (up to 21 days) / 31 USD (up to 120 days).

### 20. Kazakhstan
- **Official Source:** Ministry of Foreign Affairs of the Republic of Kazakhstan — `https://viss.gov.kz`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 14-day visa-free regime for Indian citizens (0 USD).

### 21. Uzbekistan
- **Official Source:** Official Electronic Visa Portal of the Republic of Uzbekistan — `https://e-visa.gov.uz`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Single entry 20 USD, Double entry 35 USD, Multiple entry 50 USD.

### 22. Oman
- **Official Source:** Royal Oman Police (ROP) eVisa Portal — `https://evisa.rop.gov.om`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** Fee left out of charges list due to split categories (26A/26B/26M); unsponsored visa is 20 OMR for eligible qualifying holders.

### 23. Qatar
- **Official Source:** Ministry of Interior Qatar — `https://portal.moi.gov.qa` and Discover Qatar — `https://www.discoverqatar.qa`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Visa waiver on arrival is 0 INR (mandatory hotel booking through Discover Qatar required).

### 24. Saudi Arabia
- **Official Source:** Ministry of Foreign Affairs of the Kingdom of Saudi Arabia (KSA Visa) — `https://ksavisa.sa`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** Direct tourist visa without prior US/UK/Schengen visa requires consular submission; approx. 535 SAR on official e-visa platform.

### 25. Bahrain
- **Official Source:** Nationality, Passports and Residence Affairs (NPRA) Bahrain — `https://www.evisa.gov.bh`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** Fee row omitted to prevent foreign exchange discrepancies (4 BHD app fee + 5 BHD visa fee).

### 26. Kuwait
- **Official Source:** Ministry of Interior Kuwait — `https://evisa.moi.gov.kw`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** Official consular visa fee is approx. 3 KWD; physical embassy submission required for regular applicants.

### 27. Jordan
- **Official Source:** Ministry of Interior Jordan — `https://eservices.moi.gov.jo` and Jordan Pass Portal — `https://www.jordanpass.jo`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 40 JOD (~56 USD) or waived when purchasing the Jordan Pass.

### 28. Schengen Area (Europe)
- **Official Source:** European Commission (Directorate-General for Migration and Home Affairs) — `https://home-affairs.ec.europa.eu` (Regulation (EU) 2024/1415 amending Visa Code).
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Uniform visa fee is 90 EUR for adults, 45 EUR for children aged 6–12, and 0 EUR for children under 6.

### 29. United Kingdom
- **Official Source:** UK Visas and Immigration (GOV.UK) — `https://www.gov.uk/standard-visitor`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Standard Visitor Visa fee is £115 (approx. 145 USD).

### 30. Ireland
- **Official Source:** Immigration Service Delivery, Department of Justice, Ireland — `https://www.irishimmigration.ie`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Single journey 60 EUR, Multi journey 100 EUR.

### 31. United States of America
- **Official Source:** U.S. Department of State (Bureau of Consular Affairs) — `https://travel.state.gov`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Non-immigrant MRV application fee for B1/B2 category is 185 USD.

### 32. Canada
- **Official Source:** Immigration, Refugees and Citizenship Canada (IRCC) — `https://www.canada.ca`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. 100 CAD visa fee (~75 USD) and 85 CAD biometrics fee (~65 USD).

### 33. Australia
- **Official Source:** Department of Home Affairs, Australian Government — `https://immi.homeaffairs.gov.au`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Visitor Visa (Subclass 600) base application charge is 190 AUD (~125 USD).

### 34. New Zealand
- **Official Source:** Immigration New Zealand — `https://www.immigration.govt.nz`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Visitor Visa 211 NZD + International Visitor Levy 100 NZD = 311 NZD (~190 USD).

### 35. Japan
- **Official Source:** Ministry of Foreign Affairs of Japan (MOFA) — `https://www.mofa.go.jp`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Single entry tourist visa fee is 3,000 JPY (~1,700 INR).

### 36. South Korea
- **Official Source:** Korea Visa Portal, Ministry of Justice — `https://www.visa.go.kr`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Single entry short-stay tourist visa (C-3-9) fee is 40 USD.

### 37. Hong Kong
- **Official Source:** Immigration Department, The Government of the Hong Kong Special Administrative Region — `https://www.immd.gov.hk`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Pre-arrival Registration (PAR) is free (0 INR).

### 38. China
- **Official Source:** Chinese Visa Application Service Center (CVASC) — `https://www.visaforchina.cn`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Single entry tourist visa (L) fee is 2,400 INR for Indian passport holders.

### 39. South Africa
- **Official Source:** Department of Home Affairs South Africa — `https://www.dha.gov.za`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Visa fee is waived by the South African Government for Indian citizens (0 INR).

### 40. Kenya
- **Official Source:** Republic of Kenya Electronic Travel Authorisation (eTA) — `https://www.etakenya.go.ke`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Official government fee is 32.50 USD.

### 41. Tanzania
- **Official Source:** Tanzania Immigration Services Department (e-Visa Portal) — `https://visa.immigration.go.tz`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Ordinary tourist visa fee is 50 USD.

### 42. Russia
- **Official Source:** The Ministry of Foreign Affairs of the Russian Federation (Electronic Visa Portal) — `https://electronic-visa.kdmid.ru`.
- **Date Checked:** October 30, 2026.
- **Unverified Fields:** None. Unified e-Visa fee is approx. 52 USD.

