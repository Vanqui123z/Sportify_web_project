import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from xgboost import XGBRegressor
import onnxmltools
from onnxmltools.convert.common.data_types import FloatTensorType
import onnxruntime as rt

# ===========================
# 1️⃣ TẠO DỮ LIỆU GIẢ LẬP
# ===========================

np.random.seed(42)
n_samples = 1000

# Các feature đầu vào
data = pd.DataFrame({
    "totalBookings_month": np.random.randint(150, 300, n_samples),  # Keep only monthly bookings
    "avgtempC": np.random.uniform(20, 35, n_samples),
    "dailyChanceOfRain": np.random.randint(0, 100, n_samples),
    "isHoliday": np.random.randint(0, 2, n_samples)
})

# Biến mục tiêu: số lượt đặt sân ngày mai
totalBookings_tomorrow = []
for i in range(len(data)):
    tb_month = data["totalBookings_month"].iloc[i]
    temp = data["avgtempC"].iloc[i]
    rain = data["dailyChanceOfRain"].iloc[i]
    holiday = data["isHoliday"].iloc[i]
    
    val = (
        (tb_month / 30) * 0.8 +                    # trọng số của trung bình tháng
        (35 - temp) * 0.3 +                        # trọng số của nhiệt độ
        (rain / 100) * (-2.0) +                    # trọng số của mưa
        holiday * 2 +                              # trọng số ngày lễ
        np.random.normal(0, 0.3)                   # nhiễu ngẫu nhiên
    )
    totalBookings_tomorrow.append(val)

data["totalBookings_tomorrow"] = totalBookings_tomorrow

# ===========================
# 2️⃣ CHUẨN BỊ DỮ LIỆU
# ===========================

X = data[["totalBookings_month", "avgtempC", "dailyChanceOfRain", "isHoliday"]]
# Đổi tên các cột thành f0, f1, f2, f3
X.columns = [f'f{i}' for i in range(X.shape[1])]
y = data["totalBookings_tomorrow"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ===========================
# 3️⃣ HUẤN LUYỆN MÔ HÌNH XGBOOST
# ===========================

model = XGBRegressor(
    n_estimators=120,
    max_depth=4,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"✅ Huấn luyện thành công. RMSE = {rmse:.3f}")

# ===========================
# 4️⃣ XUẤT MÔ HÌNH SANG ONNX
# ===========================

# Định nghĩa input shape và tên
input_type = [('float_input', FloatTensorType([None, X.shape[1]]))]

# Chuyển đổi sang ONNX với target opset mới nhất
onnx_model = onnxmltools.convert_xgboost(model, 
                                        initial_types=input_type,
                                        target_opset=13)

# Lưu mô hình
with open("field_booking_xgb.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())

print("✅ Đã lưu mô hình ONNX: field_booking_xgb.onnx")

# ===========================
# 5️⃣ KIỂM TRA LẠI MÔ HÌNH BẰNG ONNXRUNTIME
# ===========================

sess = rt.InferenceSession("field_booking_xgb.onnx", providers=['CPUExecutionProvider'])
input_name = sess.get_inputs()[0].name

sample = np.array([[162.0, 28.0, 50.0, 0.0]], dtype=np.float32)
pred = sess.run(None, {input_name: sample})[0]

print("🔍 Dự đoán thử với input [2, 162, 28, 50, 0] →", pred)
