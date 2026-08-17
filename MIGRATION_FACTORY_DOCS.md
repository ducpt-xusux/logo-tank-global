# Migration & Factory Mapping Documentation

## Database Schema Summary

Dưới đây là danh sách các migration, model, và factory tương ứng trong dự án.

### Core Tables

| Model     | Table           | Migration                                     | Factory          | Columns                                                                                                                                                                                                                                                   |
| --------- | --------------- | --------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User      | users           | 2014_10_12_000000_create_users_table.php      | UserFactory      | id, name, name_kana, email, password, picture, role, first_login, timestamps, soft_deletes                                                                                                                                                                |
| Logo      | lt_t_logo       | 2023_06_09_193130_create_lt_t_logo_table.php  | LogoFactory      | logo_id, state, reg_date, up_date, reg_by, up_by, logo_name, logo_explain, logo_d_id, tank_num, , last_sync_at, soft_deletes                                                                                                                      |
| Order     | lt_t_orders     | 2023_06_28_124455_create_orders_table.php     | OrderFactory     | id, user_id, price, tax, commission, tax_rate, sub_name, main_name, type, status, payment_status, payment_date, payment_type, purchase_date, sub_total, total_amount, invoice_num, delivery_address, postal_code, delivery_date, soft_deletes, timestamps |
| OrderLogo | lt_t_order_logo | 2023_06_28_125214_create_order_logo_table.php | OrderLogoFactory | logo_id, order_id, logo_manual, logo_motion, soft_deletes, timestamps                                                                                                                                                                                     |
| Favorite  | lt_t_favorites  | 2023_06_28_125328_create_favorites_table.php  | FavoriteFactory  | user_id, logo_id, timestamps                                                                                                                                                                                                                              |

### Master Data Tables (Lookup Tables)

| Model    | Table         | Migration                                        | Factory         | Columns                               |
| -------- | ------------- | ------------------------------------------------ | --------------- | ------------------------------------- |
| Color    | lt_m_color    | 2023_06_12_102538_create_lt_m_color_table.php    | ColorFactory    | id, name, name_vi, name_en, code, key |
| Industry | lt_m_industry | 2023_06_12_112302_create_lt_m_industry_table.php | IndustryFactory | id, name, name_vi, name_en, key       |
| Taste    | lt_m_taste    | 2023_06_12_112302_create_lt_m_taste_table.php    | TasteFactory    | id, name, name_vi, name_en, key       |

### Keyword & Language Tables

| Model           | Table                  | Migration                                                 | Factory                | Columns                                    |
| --------------- | ---------------------- | --------------------------------------------------------- | ---------------------- | ------------------------------------------ |
| Keyword         | lt_t_keywords          | 2023_07_14_185824_create_lt_t_keywords_table.php          | KeywordFactory         | id, name, slug, timestamps                 |
| KeywordLanguage | lt_t_keyword_languages | 2023_10_12_124136_create_lt_t_keyword_languages_table.php | KeywordLanguageFactory | id, keyword_id, language, name, timestamps |
| LogoLanguage    | lt_t_logo_languages    | 2023_06_13_180629_create_lt_logo_languages_table.php      | -                      | logo_id, language, name, timestamps        |

### Relationship Tables (Pivot/Junction)
    
| Model        | Table              | Migration                                             | Columns                           |
| ------------ | ------------------ | ----------------------------------------------------- | --------------------------------- |
| LogoAlphabet | lt_t_logo_alphabet | 2023_06_12_102017_create_lt_t_logo_alphabet.php       | logo_id, alphabet_id, timestamps  |
| LogoColor    | lt_t_logo_color    | 2023_06_12_102617_create_lt_t_logo_color_table.php    | logo_id, color_id, timestamps     |
| LogoIndustry | lt_t_logo_industry | 2023_06_12_102642_create_lt_t_logo_industry_table.php | logo_id, industry_id, timestamps  |
| LogoKeyword  | lt_t_logo_keyword  | 2023_06_12_102642_create_lt_t_logo_keyword_table.php  | logo_id, keyword_id, timestamps   |
| LogoTaste    | lt_t_logo_taste    | 2023_06_12_102818_create_lt_t_logo_taste_table.php    | logo_id, taste_id, timestamps     |
| LogoZip      | lt_t_logo_zip      | 2023_10_05_161520_create_lt_t_logo_zip_table.php      | logo_id, zip_file, download_count |

### Additional Tables

| Model         | Table               | Migration                                              | Factory              | Purpose                             |
| ------------- | ------------------- | ------------------------------------------------------ | -------------------- | ----------------------------------- |
| Contact       | lt_t_contacts       | 2023_10_06_180255_create_lt_t_contacts_table.php       | ContactFactory       | Lưu thông tin liên hệ từ người dùng |
| Setting       | lt_t_settings       | 2023_06_28_165154_create_settings_table.php            | SettingFactory       | Lưu cấu hình ứng dụng (key-value)   |
| Payment       | lt_t_payment        | -                                                      | PaymentFactory       | Lưu thông tin thanh toán            |
| Log           | lt_t_logs           | 2023_07_12_184832_create_logs_table.php                | LogFactory           | Lưu audit log của hệ thống          |
| AddressSearch | lt_t_address_search | 2023_11_17_155702_create_lt_t_address_search_table.php | AddressSearchFactory | Lưu lịch sử tìm kiếm địa chỉ        |
| Recommend     | lt_t_recommend      | 2023_06_12_110526_create_lt_t_recommend_table.php      | RecommendFactory     | Lưu gợi ý logo tương tự             |

### System Tables

| Table                  | Migration                                                 | Purpose                         |
| ---------------------- | --------------------------------------------------------- | ------------------------------- |
| password_resets        | 2014_10_12_100000_create_password_resets_table.php        | Lưu token reset mật khẩu        |
| personal_access_tokens | 2019_12_14_000001_create_personal_access_tokens_table.php | Lưu token API (Laravel Sanctum) |
| failed_jobs            | 2019_08_19_000000_create_failed_jobs_table.php            | Lưu job thất bại (queue)        |
| sessions               | 2025_12_03_172326_create_sessions_table.php               | Lưu session người dùng          |
| cache                  | 2025_12_03_181429_create_cache_table.php                  | Lưu cache data                  |

## Usage Examples

### Using Factories in Seeders or Tests

```php
// Tạo 10 users
User::factory()->count(10)->create();

// Tạo user là designer
User::factory()->designer()->create();

// Tạo 5 logo active
Logo::factory()->active()->count(5)->create();

// Tạo order đã thanh toán
Order::factory()->paid()->create();

// Tạo dữ liệu với relationship
Order::factory()
    ->has(OrderLogo::factory()->count(3))
    ->create();
```

### In Database Seeder

```php
// database/seeders/DatabaseSeeder.php
public function run()
{
    // Tạo data master trước
    Color::factory()->count(10)->create();
    Industry::factory()->count(10)->create();
    Taste::factory()->count(10)->create();
    Keyword::factory()->count(20)->create();

    // Tạo users
    $users = User::factory()->count(50)->create();
    $designers = User::factory()->designer()->count(20)->create();

    // Tạo logos
    Logo::factory()->count(100)->create();

    // Tạo orders
    Order::factory()->count(50)->create();

    // Tạo favorites
    Favorite::factory()->count(100)->create();

    // Tạo payments
    Payment::factory()->count(50)->create();
}
```

## Notes

-   **Soft Deletes**: Các bảng có `soft_deletes()` hỗ trợ xóa mềm (deleted_at)
-   **Timestamps**: Tự động tạo `created_at` và `updated_at`
-   **Relationships**: Các factory có thể sử dụng `has()` hoặc `for()` để tạo relationships
-   **Localized Names**: Các master table có tên trong 3 ngôn ngữ (VI, EN, JA)
-   **Key Field**: Các master table có `key` field dùng cho slug/identifier

## Factory Files Location

Tất cả factory files nằm trong: `database/factories/`

Danh sách factory files:

-   UserFactory.php
-   LogoFactory.php
-   OrderFactory.php
-   OrderLogoFactory.php
-   ColorFactory.php
-   IndustryFactory.php
-   TasteFactory.php
-   KeywordFactory.php
-   KeywordLanguageFactory.php
-   FavoriteFactory.php
-   ContactFactory.php
-   SettingFactory.php
-   LogoZipFactory.php
-   RecommendFactory.php
-   PaymentFactory.php
-   LogFactory.php
-   AddressSearchFactory.php
