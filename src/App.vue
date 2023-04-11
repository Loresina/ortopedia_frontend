<script>
    import axios from "axios"
    import VueDatePicker from "@vuepic/vue-datepicker"
    // import { ref } from 'vue'
    import { addMonths, getMonth, getYear, subMonths } from 'date-fns'

    import '@vuepic/vue-datepicker/dist/main.css'
    import { useVuelidate } from '@vuelidate/core'
    import { required, email, minLength } from '@vuelidate/validators'
    import Modal from "@/Modal.vue";
    import {computed} from "@vue/reactivity";
    import { reactive } from '@vue/reactivity'

    // @import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss'

    export default {
        setup: () => ({ v$: useVuelidate(),
                        form: reactive({
                            phone_number: '',
                            country_code: 'ru'
                        })}),
        data: function () {
            return {
                form: { },
                errors: [],
                city: "",
                doctors: null,
                doctor_choice: '',
                dates_choice: '',
                times: [],
                picked: '',
                full_name: '',
                adress: '',
                mail: '',
                age: Array.apply(null, Array(19)).map(function (_, i) {return i;}),
                age_choice: '',
                phone: '',
                agree: '',
                phone1: '',
                dates: [Date.now()],
                pick_date: [],
                schedule: '',
                status: '',
                isModalVisible: false,
                selected_date: null,
                date: '',
                minDate: computed(() => subMonths(new Date(getYear(new Date()), getMonth(new Date())), 1)),
                maxDate: computed(() => addMonths(new Date(getYear(new Date()), getMonth(new Date())), 1)),
                ap_patient: '',
                ap_doctor: '',
                ap_adress: '',
                ap_date: ''
            }
        },

        validations: {
            doctor_choice: {required, $autoDirty: true},
            dates_choice: {required, $autoDirty: true},
            picked: {required, $autoDirty: true},
            full_name: {required, minLength: minLength(3), $autoDirty: true},
            adress: {required, $autoDirty: true},
            mail: {required, email, $autoDirty: true},
            age_choice: {required, $autoDirty: true},
            phone: {required, $autoDirty: true},
            agree: {required, $autoDirty: true}
        },

        components: {
            'VueDatePicker': VueDatePicker,
            'Modal': Modal
        },
        date_picker() {
            return {
                dates: null,
            };
        },

        mounted() {
            axios.get('http://192.168.0.17:5000/appointment/doctors')
                    .then(res => (this.doctors = res.data));

        },

        methods: {
            post_doctor_choice() {
                axios.get('http://192.168.0.17:5000/appointment/doctors/choice?doctor=' + this.doctor_choice)
                    .then((response) => {if (response.data == 0) {
                            this.dates = [Date.now()]; this.times = [];
                        } else {
                            this.dates = response.data; this.times = [];
                        }});

            },

             post_dates_choice(date) {
                if (date) {
                    axios.get('http://192.168.0.17:5000/appointment/dates/choice?date=' + date +
                        '&doctor=' + this.doctor_choice)
                    .then((response) => {this.times = response.data; this.dates_choice = date;
                    console.log(this.dates_choice)});
                }
             },

             post_form() {
                 axios.post('http://192.168.0.17:5000/appointment/form', {
                    body: {"doctor": this.doctor_choice, "date": this.dates_choice, "time": this.picked,
                        "name": this.full_name, "adress": this.adress, "mail": this.mail, "age": this.age_choice,
                           "phone": form.phone_number, "agree": this.agree}
                })
                    // .then((response) => console.log(response.data))
                    .then((response) => {if (response.status == 201) {
                        this.status = response.status;
                        this.ap_patient = response.data.ap_patient;
                        this.ap_doctor = response.data.ap_doctor;
                        this.ap_adress = response.data.ap_adress;
                        this.ap_date = response.data.ap_date;
                        this.ap_time = response.data. ap_time;
                        } else {
                             this.status = response.status;
                             this.ap_patient = response.data.ap_patient
                        }});
            },

            async submitForm () {
              const isFormCorrect = await this.v$.$validate();

              if (!isFormCorrect)
                  return;
              this.post_form()
            },

            showModal() {
                this.isModalVisible = true;
                },
            closeModal() {
                this.isModalVisible = false;
            },
        }
    }


</script>

<template>

    <div class="wrapper">
        <h2>Запись на прием, только детей до 18 лет.</h2>
        <p>Бесплатно по ОМС (кроме оформления направления на МСЭК)</p>

        <form v-on:submit.prevent="submitForm">

            <div class="field" :class="{ error: v$.doctor_choice.$errors }">
                <label for="doctors">Выберите адрес (и специалиста):</label>
                <br>
                <select id="doctors" @click="post_doctor_choice()" v-model="this.doctor_choice">
                    <option disabled value="">Выберите один из вариантов</option>
                    <option v-for="doctor in doctors" :value="doctor.id"> {{ doctor["name"] }} </option>
                </select>
                <div class="error" v-if="v$.doctor_choice.$error">* поле обязательно для заполнения</div>
            </div>

<!--            <p v-if="this.schedule">{{ this.schedule }}</p>-->

            <div class="field" >
                <label for="calendar">Выберите дату:</label>
                <div class="box" :class="{ error: v$.dates_choice.$errors }">
                <span id="calendar"> <VueDatePicker
                        @internal-model-change="post_dates_choice"
                        v-model="this.dates_choice"
                        :model-value="date"
                        :min-date="minDate"
                        :max-date="maxDate"
                        prevent-min-max-navigation
                        inline
                        locale="ru"
                        select-text=""
                        :enable-time-picker="false"
                        :allowed-dates="dates" />
                </span>
                </div>
                <div class="error" v-if="v$.dates_choice.$error">* выберите дату</div>
            </div>

            <div v-if="this.dates" class="field" :class="{ error: v$.picked.$errors }">
                <label for="v-model-radiobutton">Выберите время:</label>
                <br>
                <span id="v-model-radiobutton" v-for="time in times" >
                    <input v-model="this.picked" type="radio" name="choice" id="time" :value="time" />
                    <label for="time">{{ time }}</label>
                </span>
                <div class="error" v-if="v$.picked.$error">* поле обязательно для заполнения</div>
            </div>


            <div class="field" :class="{ error: v$.full_name.$errors }">
                <label for="full_name">ФИО пациента*:</label>
                <br>
                <input id="full_name" v-model="this.full_name" type="text" placeholder="введите ФИО" />
                <div class="error" v-if="v$.full_name.$error">* поле обязательно для заполнения</div>
            </div>

             <div class="field" :class="{ error: v$.age_choice.$errors }">
                <label for="age">Возраст пациента* (полных лет):    </label>
                <select id="age" v-model="this.age_choice">
                    <option disabled value="">0</option>
                    <option v-for="one in age"> {{ one }} </option>
                </select>
                <div class="error" v-if="v$.age_choice.$error">* поле обязательно для заполнения</div>
            </div>

            <div class="field" :class="{ error: v$.adress.$errors }">
                <label for="adress">Адрес проживания полностью<br>(город, населенный пункт, улица):</label>
                <br>
                <input id="adress" v-model="this.adress" type="text"
                           placeholder="введите адрес" />
                <div class="error" v-if="v$.adress.$error">* поле обязательно для заполнения</div>
            </div>

            <div class="field" :class="{ error: v$.mail.$errors }">
                <label for="mail">Ваш e-mail:</label>
                <br>
                <input id="mail" v-model="this.mail" type="text" placeholder="введите e-mail"/>
                <div class="error" v-if="v$.mail.$error">* поле должно быть заполнено в формате example@email.com</div>
            </div>

            <div class="phone_number" >
                <div :class="{ error: v$.phone.$errors }">
                    <label>Контактный телефон.</label>
                    <PhoneNumberWithCountryCode
                        v-model:phone_number="form.phone_number"
                        v-model:country_code="form.country_code"
                        placeholder="983 255 56 56">
                    </PhoneNumberWithCountryCode>
                <div class="error" v-if="v$.phone.$error">* пожалуйста, заполните поле в формате +79832555656</div>
                </div>
            </div>

            <div class="checkbox" :class="{ error: v$.agree.$errors }">
                <input type="checkbox" id="checkbox" v-model="this.agree" />
                <label for="checkbox"> Согласие на обработку персональных данных.</label>
                <div class="error" v-if="v$.agree.$error">* поле обязательно для заполнения</div>
            </div>

<!--        <br> <button type="submit"> ЗАПИСАТЬСЯ </button>-->

<!--            <p v-if="this.status == 201">Вы успешно записаны: {{ this.picked }} </p>-->

<!--            <p v-if="this.status == 202">Ошибка записи. Данные дата и время уже заняты: {{ this.picked }} </p>-->

            <button type="submit" @click="showModal" > ЗАПИСАТЬСЯ </button>

            <Modal v-if="this.status == 201" v-show="isModalVisible" @close="closeModal"
                   :ap_message="'Вы успешно записаны:'"
                   :ap_patient="this.ap_patient"
                   :ap_doctor="this.ap_doctor"
                   :ap_adress="this.ap_adress"
                   :ap_date=" this.ap_date "
                   :ap_time="this.ap_time" />


            <Modal v-if="this.status == 202" v-show="isModalVisible" @close="closeModal"
                   :ap_message="'Ошибка записи. Эти дата и время уже заняты:'"
                   :ap_patient="this.ap_patient"
                   :ap_doctor="this.ap_doctor"
                   :ap_adress="this.ap_adress"
                   :ap_date=" this.ap_date "
                   :ap_time="this.ap_time" />
        </form>
    </div>

</template>

<style scoped>

    .wrapper {
        /*width: 900px;*/
        /*height: 500px;*/
        border-radius: 50px;
        padding: 20px;
        background: green;
        text-align: center;
        color: white;
    }

    .wrapper div {
        margin-top: 20px;
    }

    .wrapper h2 {
        margin-top: 50px;
    }

    .wrapper p {
        margin-top: 20px;
    }

    .wrapper select {
        margin-top: 7px;
        border: 0;
        font-size: 14px;
        padding: 5px 8px;
    }

    .wrapper span {
        margin-left: 7px;
    }

    /*.wrapper div {*/
    /*    margin-top: 20px;*/
    /*}*/

    /*.wrapper vue-datepicker {*/
    /*    margin-top: 100px;*/
    /*}*/

    .wrapper input {
        margin-top: 7px;
        background: white;
        color: black;
        font-size: 16px;
        padding: 5px 50px;
        text-align: center;
    }


    .wrapper .field,
    .wrapper .checkbox {
        margin-top: 40px;
    }


    /*.phone_input.normal_number {*/
    /*    margin-top: 0px;*/
    /*    width: 300px;*/
    /*    display: flex;*/
    /*    padding-top: 0;*/
    /*    justify-content: center;*/
    /*}*/


    .wrapper .phone_number {
        margin-top: 40px;
        /*width: 300px;*/
        display: flex;
        padding-top: 0;
        justify-content: center;
    }

    .phone_number label {
        font-size: 20px;
    }

    .field .error,
    .checkbox .error,
    .phone_number .error {
        margin-top: 10px;
        color: white;
        font-size: 16px;
    }

    .box {
        display: flex;
        justify-content: center;
        padding-top: 0;

    }

    /*.wrapper input:focus {*/
    /*    border-bottom-color: navajowhite;*/
    /*}*/

    .wrapper button {
        margin-top: 20px;
        background: white;
        color: green;
        border-radius: 10px;
        border: 2px solid darkgreen;
        padding: 10px 15px;
        cursor: pointer;
        transition: transform 500ms ease;
    }

    .wrapper button:hover {
        transform: scale(1.1) translateY(-5px);
    }

</style>