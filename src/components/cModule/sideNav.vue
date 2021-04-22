<template>
  <div class="navMenu">

    <template v-for="navMenu in navMenus">
        <!-- 最后一级菜单 -->
      <el-menu-item v-if="!navMenu.children"
                    :key="navMenu.id" :data="navMenu" :index="navMenu.path" 
                   >
        <i :class="navMenu.icon"></i>
        <span slot="title">{{navMenu.name}}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu v-if="navMenu.children"
                  :key="navMenu.id" :data="navMenu" :index="navMenu.path">
        <template slot="title">
          <i :class="navMenu.icon"></i>
          <span> {{navMenu.name}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.children"></NavMenu>
      </el-submenu>
    </template>

  </div>
</template>

<script>
  export default {
    name: 'NavMenu',
    props: ['navMenus'],
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style>
</style>
