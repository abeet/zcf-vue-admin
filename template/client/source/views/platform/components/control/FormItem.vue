<template>
  <el-form-item :prop="field.code" :label="field.name" :rules="rules">
    <slot>
    </slot>
  </el-form-item>
</template>

<style scoped>

</style>

<script>
  export default {
    data() {
      return {
        rules: []
      };
    },
    computed: {},
    methods: {
      getFieldDataType(rule){
        if(this.field.controlType === 'Checkbox'){
          rule.type = 'array';
          return;
        }

        switch (this.field.dataType){
          case 'Long':
            rule.type = 'number';
            break;
          case 'Double':
            rule.type = 'number';
            break;
          case 'Datetime':
            rule.type = 'date';
            break;
        }
      },
      generateRules(){
        this.rules = [];
        const items = this.field.verifyRule ? this.field.verifyRule.split('&&') : [];
        const expressions = {
          'Number': {
            re: /^\d+(\.\d+)?$/,
            msg: '必须是数字！'
          },
          'Int': {
            re: /^-?\d+$/,
            msg: '必须是整数！'
          },
          'Time': {
            re: /^\d{2}:\d{2}:\d{2}$/  ,
            msg: '必须是时间格式（HH-mm-ss）！'
          },
          'Date': {
            re: /^\d{4}-\d{2}-\d{2}$/,
            msg: '必须是日期格式（yyyy-MM-dd）！'
          },
          'DateTime': {
            re: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
            msg: '必须是日期时间格式（yyyy-MM-dd HH:mm:ss）！'
          },
          'Email': {
            re: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            msg: '必须是Email！'
          },
          'ZipCode': {
            re: /^[1-9][0-9]{5}$/,
            msg: '必须是邮政编码（中国）！'
          },
          'CnTel': {
            re: /^0\d{2,3}-?\d{7,8}$/,
            msg: '必须是固定电话号码（中国）！'
          },
          'CnMobile': {
            re: /^1\d{10}$/,
            msg: '必须是移动电话号码（中国）！'
          },
          'CnPhone': {
            re: /(^1\d{10}$)|(^0\d{2,3}-?\d{7,8}$)/,
            msg: '必须是固定或移动电话（中国）！'
          },
          'IDCardNo': {
            re: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
            msg: '必须是身份证号码（中国）！'
          },
        };

        const getValidator = () => {
          return (expression, fieldName) => {
            return (rule, value, callback) => {
              if (expression.re.test(value)) {
                callback();
              } else if (value === '') {
                callback(); //
              } else {
                callback(new Error(`${fieldName},${expression.msg}`));
              }
            };
          };
        };

        if(this.field.mandatoryFlag === 'Y' || items.includes('NotNull')){
          let requiredRule = { required: true, message: `${this.field.name},不能为空！`, trigger: 'blur,change' };
          this.getFieldDataType(requiredRule);
          this.rules.push(requiredRule);
        }

        for(let prop in expressions){
          if(items.includes(prop)){
            this.rules.push({
              trigger: 'blur,change',
              validator: getValidator()(expressions[prop], this.field.name) });
          }
        }

        // 正则表达式
        const regexOption = items.find(val => val.startsWith('Regex='));

        if(regexOption){
          const regexItems = regexOption.split('=');
          if(regexItems.length !== 2 || !regexItems[1]){
            return;
          }

          const regexExpression = {
            re: new RegExp(regexItems[1]),
            msg: '无效字符串！'
          };

          this.rules.push({
            trigger: 'blur,change',
            validator: getValidator()(regexExpression, this.field.name) });
        }

        // 长度
        const lengthOption = items.find(val => val.startsWith('Length'));

        if(lengthOption){
          let lengthRule = { trigger: 'blur,change' },
            lengthItems;

          if(lengthOption.indexOf('=') > -1){
            lengthItems = lengthOption.split('=');
            lengthRule.max = parseInt(lengthItems[1]);
            lengthRule.min = parseInt(lengthItems[1]);
            lengthRule.message = `${this.field.name},长度必须等于${lengthItems[1]}`;
          }

          if(lengthOption.indexOf('>') > -1){
            lengthItems = lengthOption.split('>');
            lengthRule.min = parseInt(lengthItems[1]) + 1;
            lengthRule.message = `${this.field.name},长度必须大于${lengthItems[1]}`;
          }

          if(lengthOption.indexOf('<') > -1){
            lengthItems = lengthOption.split('<');
            lengthRule.max = parseInt(lengthItems[1]) - 1;
            lengthRule.message = `${this.field.name},长度必须小于${lengthItems[1]}`;
          }

          this.rules.push(lengthRule)
        }

        // todo: javascript脚步 验证规则

      }
    },
    watch:{
      field() {
        this.generateRules();
      }
    },
    created() {
      this.generateRules();
    },
    props: {
      field: {
        type: Object,
        required: true
      }
    }
  };
</script>
