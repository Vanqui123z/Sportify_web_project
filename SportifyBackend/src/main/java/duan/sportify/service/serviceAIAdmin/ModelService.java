package duan.sportify.service.serviceAIAdmin;
import ai.onnxruntime.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class ModelService {

    private final OrtEnvironment env;
    private final OrtSession session;

    public ModelService() throws OrtException, IOException {
        env = OrtEnvironment.getEnvironment();
        session = env.createSession("src/main/resources/models/field_booking_xgb.onnx",
                                    new OrtSession.SessionOptions());
    }

    public float predictSingle(float[] inputData) throws OrtException {
        // inputData là vector feature [x1, x2, ..., xn]
        Map<String, OnnxTensor> inputMap = new HashMap<>();

        // tạo tensor 2D (1 hàng, n cột)
        OnnxTensor inputTensor = OnnxTensor.createTensor(env, new float[][]{inputData});
        String inputName = session.getInputNames().iterator().next();
        inputMap.put(inputName, inputTensor);

        // chạy inference
        OrtSession.Result result = session.run(inputMap);
        float[][] preds = (float[][]) result.get(0).getValue();

        return preds[0][0];
    }
}
