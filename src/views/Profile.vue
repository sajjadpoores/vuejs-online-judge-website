<template>
  <div class="profile-view">
      <!-- profile-view header -->
      <div class="profile-view-header">
          <span>پروفایل</span>
      </div>
      <!-- end of profile-view header -->

      <!-- profile-view content -->
      <div class="profile-view-content">
          <!-- avatar column -->
        <div class="avatar-col">
            <img id="avatarItself" :src="backendUrl + profileDetail.avatar_url" alt="">
            <input id="avatarInput" type="file" style="display:none;" accept="image/x-png,image/gif,image/jpeg" @change="imageSelected"/>
            <button class="upload-btn" onclick="document.getElementById('avatarInput').click();">آپلود تصویر</button>
            <div alt=""></div>
        </div>
        <!-- end of avatar column -->

        <!-- detail column -->
        <div class="detail-col">
            <!-- detail items (profile form) -->
            <div class="detail-item">
                <div class="detail-item-key">
                    نام کاربری
                </div>

                <div class="detail-item-value">
                    <input type="text" :value="profileDetail.username" disabled class="nice-input"
                    >
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-item-key">
                    کلمه عبور
                </div>
                <div class="detail-item-value">

                    <div class="multiple-input-container">
                        
                        <input type="password" placeholder="" 
                        value=".........." 
                        :disabled="!doingEdit.password" class="nice-input"
                        id="passwordInput"
                        >
                        
                        <span class="validationError" 
                        id="passwordValidationError" v-if="passwordError">{{ passwordError }}</span>

                        <input type="password" placeholder="پسورد جدید" 
                        v-if="doingEdit.password" class="nice-input"
                        id="newPasswordInput"
                        >

                        <input type="password" placeholder="تکرار پسورد جدید" v-if="doingEdit.password" class="nice-input"
                        id="reNewPasswordInput"
                        >
                    </div>

                    <font-awesome-icon  
                        class="clickable"
                        @click="editPassword"
                        :icon="['fas', doingEdit.password ? 'check' : 'edit']" 
                    />
                </div>
            </div>


            <div class="detail-item">
                <div class="detail-item-key">
                    ایمیل
                </div>
                <div class="detail-item-value">
                    <div class="multiple-input-container">
                        <span class="validationError" id="emailValidationError"></span>

                        <input type="email" 
                        class="nice-input"
                        :value="profileDetail.email"
                        :disabled="!doingEdit.email"
                        id="emailInput"
                        >
                    </div>

                    <font-awesome-icon class="clickable"
                        @click="editNormalField('emailInput', 'email', 'emailValidationError')"
                        :icon="['fas', doingEdit.email ? 'check' : 'edit']" 
                    />
                </div>
            </div>
            
            <div class="detail-item">
                <div class="detail-item-key">
                    شماره دانشجویی
                </div>

                <div class="detail-item-value">
                    <div class="multiple-input-container">
                        <span class="validationError" id="studentValidationError"></span>

                        <div class="detail-item-value">
                            <input type="text" 
                                class="nice-input"
                                :value="profileDetail.studentID"
                                :disabled="!doingEdit.studentID"
                                id="studentIDInput"
                            >
                        </div>
                    </div>
                    <font-awesome-icon    class="clickable"
                        @click="editNormalField('studentIDInput', 'studentID', 'studentValidationError')"
                        :icon="['fas', doingEdit.studentID ? 'check' : 'edit']" 
                    />
                </div>
            </div>


            <div class="detail-item">
                <div class="detail-item-key">
                    شماره ملی
                </div>
                <div class="detail-item-value">
                    <div class="multiple-input-container">
                        <span class="validationError" id="nationalValidationError"></span>

                        <input type="text" 
                            id="nationalIDInput"
                            class="nice-input"
                            :value="profileDetail.nationalID"
                            :disabled="!doingEdit.nationalID"
                        >
                    </div>

                    <font-awesome-icon class="clickable"
                        @click="editNormalField('nationalIDInput', 'nationalID', 'nationalValidationError')"
                        :icon="['fas', doingEdit.nationalID ? 'check' : 'edit']" 
                    />
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-item-key">
                    شماره تلفن
                </div>
                <div class="detail-item-value">
                    <div class="multiple-input-container">
                        <span class="validationError" id="phoneValidationError"></span>

                        <input type="text"
                        id="phoneInput"
                        class="nice-input"
                        :disabled="!doingEdit.phone"
                        :value="profileDetail.phone"
                        >
                    </div>

                    <font-awesome-icon 
                        :icon="['fas', doingEdit.phone   ? 'check' : 'edit']" 
                        class="clickable"
                        @click="editNormalField('phoneInput', 'phone', 'phoneValidationError')"
                    />
                </div>
            </div>
            <!-- end of detail items (profile form) -->

            <!-- detail items (problems and contests) -->
            <div class="detail-label-item">
                <div class="detail-label-item-key">
                    سوالات حل شده
                </div>
                <div class="detail-label-item-values">
                    <div class="detail-label-item-value">951</div>
                </div>
            </div>


            <div class="detail-label-item">
                <div class="detail-label-item-key">
                    مسابقات شرکت کرده
                </div>
                <div class="detail-label-item-values">
                    <div class="detail-label-item-value">1323</div>

                </div>
            </div>
        <!-- end of detail items (problems and contests) -->
        </div>
        <!-- end of detail column -->
      </div>
      <!-- end of profile-view content -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import router from '@/router.js'
export default {
    name: "profile",
    data(){
        return {
            profileDetail: {
                username: null,
                email: null,
                phone: null,
                nationalID: null,
                studentID: null,
                avatar_url: null
            },
            doingEdit: {
                password: false,
                email: false,
                phone: false,
                nationalID: false,
                studentID: false,
                avatar_url: false
            },
            passwordError: null
        }
    },
    methods: {
        ...mapActions['getProfile', 'updateProfile'],
        ValidateFileUpload(fuData) {
            var FileUploadPath = fuData.value;

            //To check if user upload any file
            if (FileUploadPath == '') {
                return false
            } 
            else {
                var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase()
                //The file uploaded is an image
                if (Extension == "gif" || Extension == "png" || Extension == "bmp" || Extension == "jpeg" || Extension == "jpg") {
                // To Display
                    if (fuData.files && fuData.files[0]) {
                        return true
                    }
                } 
                else { // The file upload is NOT an image
                    return false
                }
                // on any other cases! return false
                return false
            }
        },
        imageSelected(){
            var avatarInput = document.getElementById('avatarInput')

            // if avatar is valid
            if(this.ValidateFileUpload(avatarInput)){
                // get image src
                var newAvatar = avatarInput.files[0]
                var data = new FormData()
                data.append('avatar', newAvatar, 'avatar.jpg')
                // get jwt authentication
                const jwt = this.$cookie.get('auth')
                // send put request
                axios.put(this.backendUrl + '/profile', data, 
                {
                    headers: {
                        Authorization: jwt
                    }
                }
                ).then(response => {
                    // succeed
                    // todo: see how is the response and update the state store
                    // update store state
                    // this.updateProfile(this.profileDetail)
                    console.log(response)
                    
                    // display image
                    var reader = new FileReader()
                    reader.onload = function(e) {
                        document.getElementById('avatarItself').src = e.target.result
                    }
                    reader.readAsDataURL(avatarInput.files[0])
                }).catch(error => {
                    // failed
                    // redirect home in case user is unathorized
                    if(error.response.status === 401)
                        router.push({ name: 'home' })
                    // show error
                    console.log(error)
                })
            }
        },
        editPassword(){
            this.passwordError = null

            var passwordInput = document.getElementById('passwordInput')
            var newPasswordInput = document.getElementById('newPasswordInput')
            var reNewPasswordInput = document.getElementById('reNewPasswordInput')
            // if user wants to submit change
            if(this.doingEdit.password){
                // gather info and create proper data

                var passwordData = passwordInput.value
                var newPasswordData = newPasswordInput.value
                var reNewPasswordData = reNewPasswordInput.value
                
                // doing data validation
                if(newPasswordData !== reNewPasswordData){
                    this.passwordError = 'پسورد و تکرار آن یکسان نمی باشد.'
                    return
                }
                else if(newPasswordData.length < 8){
                    this.passwordError = 'پسورد باید حداقل ۸ کاراکتر باشد.'
                    return
                }

                const data = {
                    oldPassword: passwordData,
                    newPassword: newPasswordData
                }
                // get jwt authentication
                const jwt = this.$cookie.get('auth')

                // send put request
                axios.put(this.backendUrl + '/user/password', data, 
                {
                    headers: {
                        Authorization: jwt
                    }
                }
                ).then(response => {
                    // seccess
                }).catch(error => {
                    // show error
                    console.log(error)
                    // failed
                    // redirect home in case user is unathorized
                    if(error.response.status === 401)
                        router.push({ name: 'home' })

                    this.passwordError = 'پسورد اشتباه است'
                })

                // disable field
                this.doingEdit.password = false
            }
            else { // else if user wants to being able to edit the field

                    // close other fields if they are open
                this.doingEdit = {
                    email: false,
                    phone: false,
                    nationalID: false,
                    studentID: false,
                    avatar_url: false
                }
                // enable the field
                this.doingEdit.password = true

                passwordInput.value = ""
                passwordInput.placeholder = "کلمه عبور فعلی"
            }            
        },
        editNormalField(fieldInputId, fieldName, errorSpanId){
            var fieldInput = document.getElementById(fieldInputId)
            var errorField = document
                        .getElementById(errorSpanId)
            errorField.style.display = 'none'

            if(this.doingEdit[fieldName]){
                // gather info and create proper data
                var newFieldData = fieldInput.value

                // validation
                if(fieldName === 'email'){
                    if(!this.validateEmail(newFieldData)){
                        errorField.style.display = 'inline'
                        errorField.innerHTML = 'ایمیل وارد شده صحیح نیست'
                        return
                    }
                }
                else if(fieldName === 'nationalID') {
                    if(!this.checkCodeMeli(newFieldData)){
                        errorField.style.display = 'inline'
                        errorField.innerHTML = 'شماره ملی وارد شده صحیح نیست'
                        return
                    }
                }
                else if(fieldName === 'phone'){
                    if(!this.validatePhone(newFieldData)){
                        errorField.style.display = 'inline'
                        errorField.innerHTML = 'شماره وارد شده صحیح نیست'
                        return
                    }
                }

                var data = new FormData();
                data.append(fieldName, newFieldData)
                        
                // get jwt authentication
                const jwt = this.$cookie.get('auth')

                // send put request
                axios.put(this.backendUrl + '/profile', data, 
                {
                    headers: {
                        Authorization: jwt
                    }
                }
                ).then(response => {
                    console.log(response)
                    // seccess
                    this.profileDetail[fieldName] = newFieldData
                    // update store state
                    this.updateProfile(this.profileDetail)
                }).catch(error => {
                    // failed
                    // redirect home in case user is unathorized
                    if(error.response.status === 401)
                        router.push({ name: 'home' })
                    // show error
                    console.log(error)
                })
                
                // disable field input
                this.doingEdit[fieldName] = false
            }
            else {
                // close other fields if they are open
                this.doingEdit = {
                    password: false,
                    email: false,
                    phone: false,
                    nationalID: false,
                    studentID: false,
                    avatar_url: false
                }
                // enable field input
                this.doingEdit[fieldName] = true
            }
        },
        checkCodeMeli(code) {
            var L=code.length;

            if(L<8 || parseInt(code,10)==0) return false;
            code=('0000'+code).substr(L+4-10);
            if(parseInt(code.substr(3,6),10)==0) return false;
            var c=parseInt(code.substr(9,1),10);
            var s=0;
            for(var i=0;i<9;i++)
                s+=parseInt(code.substr(i,1),10)*(10-i);
            s=s%11;
            return (s<2 && c==s) || (s>=2 && c==(11-s));
            return true;
        },
        validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            return re.test(String(email).toLowerCase())
        },
        validatePhone(phone) {
            var re = /^09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}$/
            return re.test(String(phone))
        }
    },
    computed: {
        ...mapState(['backendUrl'])
    },
    mounted(){
        const jwt = this.$cookie.get('auth')

        axios.get(this.backendUrl + '/profile', {
            headers: {
                Authorization: jwt
            }
        }).then(response => {
            this.formData = this.profileDetail = response.data.body
        })
        .catch((error) => {
            // redirect home in case user is unathorized
            if(error.response.status === 401)
                router.push({ name: 'home' })
        //  do nothing
        })
    }
}
</script>

<style scoped>
    /* general rules */
    .clickable{
        cursor: pointer;
    }
    
    .nice-input {
        padding: 7px;
        border: 0;
        border-radius: 5px;
        text-align: center;
    }

    .validationError {
        color: red;
        font-size: 1.1rem;
        text-align: center;
        direction: rtl;
        display: none
    }
    .nice-input:disabled{
        background-color: gray;
        color: white;
    }

    .multiple-input-container {
        display: flex;
        flex-direction: column;
    }

    .multiple-input-container > * {
        flex-basis: 100%;
        /* TODO: add margin-top on edit password */
        margin-top: 10px;
    }

    .multiple-input-container > *:first-child{
        flex-basis: 100%;
        /* TODO: add margin-top on edit password */
        margin-top: 0px;
    }

    /* end of general rules */

    /* whole view */
    .profile-view{
        font-size: 1.4rem;
        direction: rtl;
        margin: 10px;
    }
    /* end of whole view */

    /* profile header */
    .profile-view-header{
        color: var(--dark-blue);
        background-color: var(--light-gray);
        border-radius: 5px;
        padding: 5px 20px;
        margin: 8px;
    }
    /* end of profile header */

    /* profile container */
    .profile-view-content{
        background-color: var(--gray-blue);
        border-radius: 5px;
        padding: 5px;
        margin: 8px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .profile-view-content > * {
        margin: 0 10px;
    }
    /* end of profile container */

    /* avatar section */
    .profile-view-content .avatar-col{
        /* flex: 2; */
        padding: 5px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .profile-view-content .avatar-col > *{
        margin-bottom: 8px;
        width: 250px;
        border-radius: 5px;
    }

    .profile-view-content .avatar-col .upload-btn {
        padding: 5px;
        border: 0;
        font-size: 1.3rem;
        font-family: "vazir", sans-serif;
        background-color: var(--greenest);
        color: white;
    }

    /* end of profile section */

    /* detail section */

    .profile-view-content .detail-col{
        /* flex: 4; */
        padding: 10px;
    }

    /* detail item */
    .profile-view-content .detail-col .detail-item{
        display: flex;
        flex-wrap: wrap;
        margin: 10px 0;
        flex: 1;
    }

    .profile-view-content .detail-col .detail-item .detail-item-key{
        flex: 3;
        font-size: 1.3rem;
    }

    .profile-view-content .detail-col .detail-item .detail-item-value{
        flex: 7;
        direction: ltr;
        display: flex;
        align-items: baseline;
    }
    .profile-view-content .detail-col .detail-item .detail-item-value > *:first-child{
        flex-basis: 90%;
    }


    .profile-view-content .detail-col .detail-item .detail-item-value > *:nth-child(2){
        position: relative;
        top: 4px;

        margin-left: 2%;
        margin-right: auto;
    }

    .profile-view-content .detail-col .detail-item .detail-item-value svg{
        color: var(--greenest);
    }

    /* change detail items on tablet size screens */
    @media screen and (max-width: 735px) {
        .profile-view-content .detail-col .detail-item{
            flex-direction: column;
            align-items: center;
        }

        .profile-view-content .detail-col .detail-item .detail-item-value > *:first-child{
            flex-basis: 100%;
        }

        .profile-view-content .detail-col .detail-item .detail-item-value > *:nth-child(2){
            flex-basis: 96%;
            margin-left: 2%;
        }

        .profile-view-content .avatar-col > *{
            width: 200px;
        }

    }


    /* change detail items on mobile size screens */

    @media screen and (max-width: 675px) {
        .profile-view-content{
            flex-direction: column;
        }

        .profile-view-content .avatar-col > *{
            width: 100%;
        }
    }


    /* end of detail item */

    /* label item */
    .detail-label-item{
        margin-top: 30px;
        display: flex;
        flex-direction: column;
    }

    .detail-label-item-key{
        font-size: 1.3rem;
    }

    .detail-label-item-values{
        margin-top: 5px;
        display: flex;
        flex-wrap: wrap;
    }

    .detail-label-item-value{
        font-size: 1.2rem;
        margin: 2px;
        padding: 3px;
        border-radius: 5px;
        color: var(--verylight-blue);
        background-color: var(--light-blue);
    }
    /* end of label item */

    /* end of detail section */
</style>