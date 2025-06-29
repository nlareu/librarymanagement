use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Asset {
    pub id: String,
    pub title: String,
    #[serde(rename = "type")]
    pub asset_type: String,
    pub description: String,
    #[serde(rename = "registrationNumber")]
    pub registration_number: Option<String>,
    pub signature: Option<String>,
    pub isbn: Option<String>,
    pub author: Option<String>,
    pub publisher: Option<String>,
    #[serde(rename = "publicationPlace")]
    pub publication_place: Option<String>,
    pub edition: Option<String>,
    #[serde(rename = "publicationYear")]
    pub publication_year: Option<String>,
    #[serde(rename = "collectionTitle")]
    pub collection_title: Option<String>,
    #[serde(rename = "collectionNumber")]
    pub collection_number: Option<String>,
    pub volumes: Option<i32>,
    pub copies: Option<i32>,
    #[serde(rename = "isLoanable")]
    pub is_loanable: Option<bool>,
    pub subjects: Option<Vec<String>>, // Array of strings
    #[serde(rename = "ibicSubjects")]
    pub ibic_subjects: Option<Vec<String>>, // Array of strings
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    #[serde(rename = "userCode")]
    pub user_code: String,
    pub name: String,
    #[serde(rename = "lastName")]
    pub last_name: String,
    #[serde(rename = "type")]
    pub user_type: String, // 'Estudiante' | 'Profesor' | 'Personal'
    pub grade: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveLoan {
    pub id: String,
    #[serde(rename = "assetId")]
    pub asset_id: String,
    #[serde(rename = "assetTitle")]
    pub asset_title: String,
    #[serde(rename = "userId")]
    pub user_id: String,
    #[serde(rename = "userName")]
    pub user_name: String,
    #[serde(rename = "borrowDate")]
    pub borrow_date: String, // ISO string
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoanHistoryRecord {
    pub id: String,
    #[serde(rename = "assetId")]
    pub asset_id: String,
    #[serde(rename = "assetTitle")]
    pub asset_title: String,
    #[serde(rename = "userId")]
    pub user_id: String,
    #[serde(rename = "userName")]
    pub user_name: String,
    #[serde(rename = "borrowDate")]
    pub borrow_date: String, // ISO string
    #[serde(rename = "returnDate")]
    pub return_date: String, // ISO string
}
