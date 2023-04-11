<script>
  export default {
    name: 'modal',
    props: {ap_message: String, ap_information: String, ap_patient: String, ap_doctor: String, ap_adress: String,
        ap_date: String, ap_time: String},

    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
            <b> {{ ap_message }} </b>
<!--          <button-->
<!--            type="button"-->
<!--            class="btn-close"-->
<!--            @click="close"-->
<!--          >-->
<!--            x-->
<!--          </button>-->
        </slot>
      </header>
      <section class="modal-body">
        <slot name="body">
            <b> пациент: </b> {{ ap_patient }}
            <p><b> доктор: </b> {{ ap_doctor }} </p>
            <p><b> адрес: </b> {{ ap_adress }} </p>
            <p><b> дата: </b> {{ ap_date }} </p>
            <p><b> время: </b> {{ ap_time }} </p>
        </slot>
          <slot v-if="this.status == 202" name="body">
            <b> пациент: </b> {{ ap_patient }}
            <p><b> доктор: </b> {{ ap_doctor }} </p>
            <p><b> адрес: </b> {{ ap_adress }} </p>
            <p><b> дата: </b> {{ ap_date }} </p>
            <p><b> время: </b> {{ ap_time }} </p>
        </slot>
       </section>
       <footer class="modal-footer">
          <slot name="footer">

            <button
              type="button"
              class="btn-green"
              @click="close"
            >
              Закрыть
          </button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    width: 315px;
    /*height: 300px;*/
    background: white;
    /*box-shadow: 2px 2px 20px 1px;*/
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    border: 2px solid green;
  }

  .modal-header,
  .modal-footer{
    color: black;
    padding: 15px;
    /*display: flex;*/
    /*position: relative;*/

  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;

  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
    display: flex;
  }

  .modal-body {
    color: black;
    /*position: relative;*/
    padding: 20px;
    text-align: left;
    vertical-align: top;
   }

  .modal-body p {
    margin-top: 3px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: green;
    border: 3px solid green;
    justify-content: space-between;
    cursor: pointer;
    border-radius: 3px;
  }
</style>