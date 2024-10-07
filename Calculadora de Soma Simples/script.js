function calcularSoma() {

    const numero1 = parseFloat(document.getElementById("numero1").value);
    const numero2 = parseFloat(document.getElementById("numero2").value);

    if (isNaN(numero1) || isNaN(numero2)) {
        alert("Por favor, insira dois números válidos.");
        return;
    }

    const soma = numero1 + numero2;

    alert("A soma dos números é: " + soma);
}
