<template>
  <!-- <div class="login-form">
      <!--element版
      <div class="drag">忘记密码</div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="手机号" prop="phonenumber">
          <div class="form-group">
            <div class="input-container">
              <el-input id="phonenumber" v-model="phonenumber" type="text" placeholder="请输入手机号" clearable></el-input>
              <el-button class="button1" type="primary" :disabled="isButtonDisabled" @click="sendVerificationCode">
                {{ isButtonDisabled ? `${countdown}秒后重发` : '发送验证码' }}
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode">
          <el-input v-model="verificationCode" type="text" placeholder="请输入验证码" clearable style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button class="button2" type="primary" size="mini" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
      <div class="tips" style="float:right; margin-right: 10%;">
        <el-link @click="backLogin">记起密码？点击登录</el-link>
      </div>
    </div> -->
  <div class="login-form">
    <!--element版-->
    <div class="drag">忘记密码</div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="手机号" prop="phonenumber">
        <el-input
          id="phonenumber"
          v-model="phonenumber"
          type="text"
          placeholder="请输入手机号"
          clearable
          style="width: 90%"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verificationCode">
        <div class="form-group">
          <div class="input-container">
            <el-input
              v-model="verificationCode"
              type="text"
              placeholder="请输入验证码"
              clearable
            ></el-input>
            <el-image
              class="image-checkCode"
              :src="checkCodeImage"
              @click="changeCheckCode"
              fit="contain"
            />
          </div>
        </div>
      </el-form-item>

      <el-form-item align="center">
        <el-button class="button2" type="primary" size="mini" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
    <div class="tips" style="float: right; margin-right: 10%">
      <el-link @click="backLogin">记起密码？点击登录</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import instance from '../axios'
import { ElMessage } from 'element-plus'

const { ipcRenderer } = window.require('electron')

// 定义响应式数据
const phonenumber = ref('')
const verificationCode = ref('')
const isButtonDisabled = ref(false)
const countdown = ref(60)
const checkCodeImage = ref(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAqCAIAAADK0mkfAAAKvElEQVR4Xu1YeVSU1xUH16BGY2wSUo+JJYmNxtqcmqWx2ta0TY1tPLU5TZM2njZNwyCISt0idYtGo9alGm0Csg+LoKMoCggqCkhYZ2EfYBiWAWFYhmEdZu3vmwdfPt43YxwclT+45545b+6792Pej3vv+93PxTIqdy0utGFU7MuIBstkNodLpX8ViZaEhOATa1hopwcoIxcs4OKZkLA+KalEre7R6/GJNSwPEa+RCxbyaF1SEmWEBXbK+MBk5IK16tw5ZBNlhAX2h1WeIxcsAIHqo4ywwP6wynPkgmUvs5ZHRj6s8hy5YNnrWQDLJogAlzI6Xe4EVsLhpcFrJkVunnl2948vH/3N9ZBV4sS9jRU3jQYd7eo8uVKvnRkpe/ls6X8Lmz66eIlfbncoT8p4t2I2N8pv3Aj/R8y254N93IK8J8b4e+CruiaPcrQLVn9vx6nV4wM8XfiKJ1468isA16z4xmwy0pH3INvzGlwD8l0C8scEMp9Ajd/I7ZXn8DKru73+0tFf88/IqMA1M9rHZDKwznbBUuTHIaAsPbBJkaWUxpfc/CovftvVwD+f2TU/UDCGfWL4hieK007QwcOSs9XtLlakpoZKqjt1k4PFL5wuop3sl+cwelZHc0W43wycImz99PyEXa11Er2uy6DvbW8swddg38nYunbqA9bfLlhpoX+Da4/2Nr1hTbpaWQJQR97CR7jRnfYYlvwxpYqA9U5y5eZsFRaf3KyB3WAyxynaP7qh9M9Vhctbc9Xd/7zohNvQqO+L3fEifr/o8590a1RIDpRL6NqpoeumXTi4uL44GWWIGoJD6c2vSYgdsMzmiA1PIolo+1BRK3NJfuEfQu85KDjo9DAJAWu/5PZjocw6qrKtTNM3O7qQ2Fl9Ka6EX570E79L5Flh+OU4plZdlXj87W+rb1ArsoXILyyAYF93q8UeWM3KHDjlnN9KbwwVFCZ5bkeTnN5zUEra+1gsPitoJAtVt947o5as379aHVnZtiWHybinImTc2JNp6sUHy2dtKZy6VjLOq8BVkO/iaUNhX7C7pKJ54HZCHuGXF6YeSRd6YhHk8wg+k0+u0DSWalsUWMdu/2FXaw05IBq0xR5YeRd3wINcB2lhfw/0Gouqjt05N/HYsoxIL2nygcrcaFXZ1TO7F5BntTcU049wUILLWwgoc2OLV15h6tEjpgjZ4i6UEXuqSgu3PVYcP7hWzY0dv7qAD409XXasgkRFbZmFXw5cUHdYXDjwMxzHZGTu2V5tE4EPaxwc6/NfvG6xB5Zo78LorbOxQDDYA0EElXzlq5X8KxKFbTL0049wUN5LVRBQduU34hLEAt19R14DMc4Il6JztekMj4Yw5Zmn7uHGuvmIxwjyc5Xdde392j6j3mimitJoYiwTvRlMJ/uKiZH0I9CgkLWPYhG19VnUHdmSJH0BCzoa1tH+PwiwVqLFJlho6rg1s+L8sAY54OICmEG+wEEkyfuvB39IjJeP/ZZ+hIPSazDh7iO4oB4fD5OSNavrbtXBjZQn2j8V7r5RhhLr0pmm+Ir5qUTpWK8CEnV+/0+5R0P1oMfD3iBPIyUpSdzX36clu8gYi02wKrMjsd1Qdg3rwqtHuU9klaFag/Tk3qmDqFpDQEEN4itaFajpiWL1uykK0AhkU10Xk7nYhQ8Klgqft7OYD4o9ZTOrRnaROhR6iyIvliB1ft9rhv4e5ATZwr1vsQlWtmjzKe8JuFmxZtMHmhW7vrbwUml6QEa0N/4tYLowhvk9Tm4KyMm4tMUfH5y1fMvUn68d95qX6ysCl4WefIV9wfu7K2qb2b8IWkDA+tGZksCyFpCDboOJbOlN5qbeAb4+JWQg+3AbptQzLYyIp7CGD4o9nb21kA1Eax5oMgJXFGNBwmdY4CvyQNfd1tvZTBoWFNOLxSZYSV/+7uyel8k678J2bpMCHQVMlTlRFitPwejDIgUZ//pqPjT2dJnvMTbw+Zgiqu7A4OecLv7wenWovLWjf2BI0PYbA0pbFsWXw8EtWMz2JfSpOdvvlFwoUvS1GX5SD/+iQylNg3G05Mb/G2e8KfwEzAlkCNclS79JhdoAK3T9Y+f2vqIqTW2pye/rVKPHd7XVttZLwdOKrh3DhYhgtC0Lj9q4LfIZ86ogt0RZ19Su7e7TG+hOazQxnXbiG94Aa/JiX9Y+abBh2dQXrbXZ0KNH40clJtVpHwkSA0o2HNTh6U0yPkZ8yLjUgS+Eed06vbazpRqTCdbpkQJ84q4jt6QNsIAUm0rQqE+fAeR9Xd92ClQ7alB65SAniBH3tzaixLp6dFOW+PJTidKxr3qxgeDrZCS0qc9EMYUTJm8lX4EUPkG42PDhUQe+aJrKcd6Lh34BJjRwfIErWhgKiDjYAKsq73SAlZJRkIHpsj7M6OTjBj7CibPM+9NOPij2lJtZkKK23k9zVAtFpeNOFbAweVjL82Pr0EPoKFEUqbyDaalEhkcdbAqOCZZgNpvIJAeVpRxid22Ahfq68J8lXKSIpnz9LuvSo2mARXz5c06YxXOvkA+KPZ39ju3xADQi83YXsum5mCLMPYAmXqmBnTBVop7pDHysDI862BTcXTgXBukc0RZyalAldpcGq7k6G1kHLHD34R5FF0fDAolHGAZ01g1VCUv8/jc4oRb0qTkrt/NxYRVFir42400/jxX+h4Qp3Fiu6IzmiUEFgvTaZYkVE04V9FpvxvlnSubFFaNzgTrgiuT6D4862JTyzGCcqywzqKVOTMACMWAp91CwzObT216AB3o8SENVbgyQMpuMbapCBqx/fY91rBaLGLd10zjBjChULaAFSwWHA0TpGZJKVbMGbZ7y+U5BZrlY+RS4AjCyWMdsNztvbCz3QB340qTIIjWE6ZhAAcXxye4QsOpLU7An3PQ0caJUlnqYuIGtxe16iaDODXeWkOqLqGA6+qrrSouVpmK9PInm7kScRR0sVj5ERkWuNspvkN0hYBEKiotTc7sMDCv+wCJEhvhOwVSolJwnPtjFVEmeErl5JjfcWbIiuQoTz2FZEwACj4flRmMn1n5Z9bTroChadKAFSw/LA9JbMiq7VBo92jztdHeiFJ8Tbv4+OWCMv8etGF/2BdQQsEDH4QEumxHpdbsqE4STealqNht03R1NctyS14L+wuWoicff5oY7S54IlyKJMOsAIEkrMzOHlDNZBkZKu94f0bYoyBtUMKxbseswIRL7ELCQKVQG3lkBHzfcKaLs7HexvtJyF8qmh0lIKyevHy7VdtDe90eSji/nHpPMOhYKLPBy7BVc3gNOkHTi92hMwo3uaEygHqK9C5GQFd9EwEIekXxyBTfWWUKGasI8waeejSr8ZYL8OSvhQuOnve+PoPPggK11kkCvsQEcGjAELHVNHpkkAVNmzBrMgJrGUqNB19+jQZPLPrspYsOTBKkr//sD2jw31lmyz9rd+TotVNIzOF3fbwE1xRmLr39JDovuROw0z1JK48/sms9NQkojNj5VnHYCHJcKdJZEV7bxkQLbSqx7QDVosb534R4Z9x6x02ARaWsoAlFIDXwvdufc4DWTMAmCdKBIASUZKe+r4O7DcPPW5QrU4ATr9HOk8E73vdMFLBSNCAMfRjpMyj0djcRuG6xRsSmjYDkgo2A5IKNgOSCjYDkgo2A5IKNgOSD/B3qbxNksv3yVAAAAAElFTkSuQmCC'
)
let timer: ReturnType<typeof setInterval> | undefined

const sendVerificationCode = async () => {
  if (isButtonDisabled.value) return
  const phoneNumberPattern = /^1[3-9]\d{9}$/
  if (!phoneNumberPattern.test(phonenumber.value)) {
    ElMessage('请输入正确的手机号')
    return
  }
  try {
    const response = await instance.post(
      'user/auth/find',
      {
        userName: 'test',
        phoneNumber: phonenumber.value
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.data.code == 0) {
      ElMessage('该手机号还未注册')
      phonenumber.value = ''
      return
    }
  } catch (error) {
    ElMessage('未知错误')
    phonenumber.value = ''
    return
  }

  try {
    const response = await instance.post(
      'user/auth/messageSend',
      {
        phoneNumber: phonenumber.value
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log(phonenumber)
    ElMessage.success(`${response.data.message}`)

    // 禁用按钮并开始倒计时
    isButtonDisabled.value = true
    countdown.value = 60
    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--
      } else {
        clearInterval(timer)
        isButtonDisabled.value = false
      }
    }, 1000)
  } catch (error) {
    ElMessage('网络错误')
    phonenumber.value = ''
  }
}

const next = async () => {
  startRecording()

  // if (phonenumber.value == '') {
  //   ElMessage('请输入手机号')
  //   return
  // }
  // if (verificationCode.value == '') {
  //   ElMessage('请输入验证码')
  //   return
  // }
  // try {
  //   const response = await instance.post(
  //     '/user/auth/message',
  //     {
  //       phoneNumber: phonenumber.value,
  //       messageCode: verificationCode.value
  //     },
  //     {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   )
  //   const code = response.data.code
  //   if (code != 0) {
  //     ElMessage('验证码错误')
  //     verificationCode.value = ''
  //     return
  //   }
  //   localStorage.setItem('phoneNumber', phonenumber.value)
  //   localStorage.setItem('messageCode', verificationCode.value)
  //   router.push('/setPassword')
  // } catch (error) {
  //   ElMessage('网络错误')
  //   verificationCode.value = ''
  // }
}

const changeCheckCode = async () => {
  stopRecording()
  const formData = new FormData()
  formData.append('audio', audioBlob, 'audio.wav')
  const formdate = new FormData()
  formdate.append('file', file)
  await instance
    .post('/file/uploadAvatar', formdate, {
      headers: {
        'Content-Type': 'multipart/form-data',
        token: localStorage.getItem('token')
      }
    })
    .catch((error) => {
      ElMessage.error(error)
    })

  // const response = await instance.post('/account/checkcode', {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  // if (!response) {
  //   return
  // }
  // checkCodeImage.value = response.data.data.checkCode
  // console.log(response.data)
  // console.log(checkCodeImage.value)
  // localStorage.setItem('checkCodeKey', response.data.data.checkCodeKey)
}

changeCheckCode()

const backLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.login-form {
  /* margin: 150px auto;
    padding: 60px;
    width: 400px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */

  margin: auto;
  padding-right: 20%;
  width: 100vw;
  height: 100vh;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
  /* margin-bottom: 5%; */
}

.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-container input {
  flex: 10;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333333;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

input:focus {
  border-color: #007bff;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
  outline: none;
}

.image-checkCode {
  width: 35%;
  /* padding: 10px 10px;
    padding-left: 20px; */

  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0;
  margin-right: 10%;
}

.button1 {
  width: 35%;
  padding: 10px 10px;
  padding-left: 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3);
  margin: 0;
  margin-right: 10%;
}

.button1:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.button2 {
  /* margin-top: 10px; */
  padding: 12px;
  font-size: 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3);
  width: 90%;
  margin: 0;
}

.button2:hover {
  background-color: #0056b3;
}

.button2:active {
  background-color: #004085;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3);
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004085;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.tips {
  margin-top: 1%;
  font-size: 14px;
}

.tips el-link {
  color: #000000;
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}

.drag {
  -webkit-app-region: drag;
  text-align: center;
  margin-top: 3%;
  margin-bottom: 3%;
}
</style>
