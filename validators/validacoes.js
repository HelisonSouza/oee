'use strict'

let errors = []

function ValidationContract() {
    errors = [];
}

// É requirido 
ValidationContract.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0)
        errors.push({ message: message });
}

// Tem o tamanho mínimo
ValidationContract.prototype.hasMinLen = (value, min, message) => {
    if (!value || value.length < min)
        errors.push({ message: message });
}

// Tem o tamanho máximo
ValidationContract.prototype.hasMaxLen = (value, max, message) => {
    if (!value || value.length > max)
        errors.push({ message: message });
}

// Tem o tamanho igual a
ValidationContract.prototype.isFixedLen = (value, len, message) => {
    if (value.length != len)
        errors.push({ message: message });
}

// É um email
ValidationContract.prototype.isEmail = (value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
        errors.push({ message: message });
}

//É um número
ValidationContract.prototype.isNumber = (value, message) => {
    if (typeof value != 'number')
        errors.push({ message: message });
}

// Retorna os erros
ValidationContract.prototype.errors = () => {
    return errors;
}

// Limpa o array de erros acumulados
ValidationContract.prototype.clear = () => {
    errors = [];
}

// Verifica se passou nas validações 
ValidationContract.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = ValidationContract;

