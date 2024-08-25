# YUEMTUNG #
## DATABASE ##
### users ###
  - id int(11)
  - email varchar(150)
  - password varchar(255)
  - name varchar(255)
  - createdAt timestamp
  - updatedAt timestamp

### transactions ###
  - id int(11)
  - borrower_id int(11)
  - lender_id int(11)
  - amount decimal(10,0)
  - transaction_type enum('borrow','repay')
  - createdAt timestamp
  - updatedAt timestamp

### balances ###
  - id int(11)
  - balance int(11)
  - createdAt timestamp
  - updatedAt timestamp

## วิธีการรัน ##
1.clone โปรเจ็คลงเครื่อง</br>
2.นำไฟล์ SQL ไป import</br>
3.รันคำสั่ง npm start</br>

## API PATH ##
### เข้าสู่ระบบ ###
  method POST
  - /api/auth/login
  #### Request ####
    - email
    - password

### สมัครสมาชิก ###
  method POST
  - /api/auth/register
  #### Request ####
    - email
    - password
    - name

### ยืมตังค์ ###
  method POST
  - /api/loan
  #### Request ####
    - money
    - lender

### คืนตังค์ ###
  method POST
  - /api/repayment
  #### Request ####
    - money
    - lender

### คืนตังค์ ###
  method POST
  - /api/repayment
  #### Request ####
    - money
    - lender

### หนีสิ้นทั้งหมด ###
  method GET
  - /api/debt


### transaction ทั้งหมด ###
  method GET
  - /api/transaction

authentication ที่ใช้ ใช้ JSON WEB TOKEN หรือ JWT ในการสร้าง middleware เพื่อตรวจสอบ token 
