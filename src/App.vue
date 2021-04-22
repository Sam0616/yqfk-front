<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  a {
    text-decoration: none;
  }

  a,
  input,
  button {
    outline: none;
  }

  li {
    list-style: none;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100%;
    position: relative;
    background-color: #f4f6f9;
    font-family: "microsoft yahei", Helvetica, Tahoma, Arial, "Microsoft jhengHei",
    sans-serif;
    overflow: hidden;
  }

  html {
    height: 100%;
    margin: 0;
    min-width: 1500px;
    padding: 0;
    background-color: #f4f6f9;
  }
  .el-form--inline .el-form-item {
    margin-right: 50px !important;
  }
  .cell{
    text-align: center!important;
  }
  .el-form-item__label {
    font-weight: 400 !important;
  }
  .step .el-step__line {
    background-color: #05a0ed !important;
    top: 19px !important;
  }
  .el-loading-mask{
    opacity: 0.7;
  }
  .el-dialog__wrapper{
    min-width: 1920px;
  }
  .step .el-step__icon {
    width: 40px !important;
    height: 40px !important;
    background-color: #05FFFC!important;
    color: #0b74a8 !important;
  }
  .step .el-step__icon.is-text {
    border-color: #05FFFC!important;
  }
  .step .el-step__head.is-success {
    border-color: #1489CC !important;
  }
  .bot .el-input__inner {
    background-color: #031a48 !important;
    border: 1px solid #1489cc !important;
    color: #05a0ed !important;
    border-radius: 0px!important;
  }
  .config .el-upload{
    text-align: left!important;
  }
  .bot .el-input-group__append, .el-input-group__prepend {
    background-color: #031a48 !important;
    border: 1px solid #1489cc !important;
  }
  .loginIng .el-input-group__prepend{
    border-radius: 0px!important;
    padding: 0 10px!important;
  }

  .psd .el-input-group__prepend{
    padding: 0 11px!important;
  }
  .bot .el-form * {
    border-radius: 0px !important;
  }
  .bot .el-button--primary,.bot .el-button {
    color: #fff!important;
    background-color: #1adcff!important;
    border-color: #1adcff!important;
  }
  .step .el-step__main {
    color: #1489cc !important;
    margin-left: -10px !important;
  }
  .step .is-process {
    color: #05fffc !important;
  }
  .step .el-step__title.is-success {
    color: #05FFFC!important;
  }
  .step .is-wait {
    color: #1489cc !important;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input[type="file"] {
    opacity: 0;
  }

  h1 {
    font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  h7,
  ul,
  li,
  p {
    margin: 0;
    padding: 0;
  }
</style>
