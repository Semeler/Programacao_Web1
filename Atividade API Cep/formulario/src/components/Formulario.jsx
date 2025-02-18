import React, { useState, useEffect } from "react";
import "../styles/Formulario.css";

const Formulario = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    cpf: "",
    telefoneFixo: "",
    celular: "",
    nomePai: "",
    nomeMae: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({});
  const [idade, setIdade] = useState(null);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);

  // Função para buscar o endereço pelo CEP
  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prevState) => ({
          ...prevState,
          endereco: data.logradouro,
          cidade: data.localidade,
          estado: data.uf,
        }));
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar CEP. Tente novamente.");
    }
  };

  // Monitora mudanças no campo CEP
  useEffect(() => {
    if (formData.cep.length === 8) {
      buscarEnderecoPorCEP(formData.cep);
    }
  }, [formData.cep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validação em tempo real
    if (name === "dataNascimento") {
      const idadeCalculada = calcularIdade(value);
      setIdade(idadeCalculada);
    }
  };

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11) return false;
    // Implementar validação de dígitos verificadores (opcional)
    return true;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha) => {
    return senha.length >= 8;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novosErros = {};

    // Validações
    if (!formData.nomeCompleto || formData.nomeCompleto.split(" ").length < 2) {
      novosErros.nomeCompleto = "Nome completo é obrigatório (nome e sobrenome).";
    }
    if (!formData.dataNascimento || idade < 0) {
      novosErros.dataNascimento = "Data de nascimento inválida.";
    }
    if (idade < 18 && (!formData.nomePai || !formData.nomeMae)) {
      novosErros.nomePai = "Nome do pai é obrigatório para menores de 18 anos.";
      novosErros.nomeMae = "Nome da mãe é obrigatório para menores de 18 anos.";
    }
    if (!validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido.";
    }
    if (!validarEmail(formData.email)) {
      novosErros.email = "Email inválido.";
    }
    if (!validarSenha(formData.senha)) {
      novosErros.senha = "Senha deve ter no mínimo 8 caracteres.";
    }
    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      setEnviadoComSucesso(true);
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Informações Pessoais</h2>

      {/* Nome Completo */}
      <div className="campo-grupo">
        <label>Nome Completo</label>
        <input
          type="text"
          name="nomeCompleto"
          value={formData.nomeCompleto}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
        />
        {!errors.nomeCompleto && formData.nomeCompleto && (
          <div className="feedback valid">
            <i className="fas fa-check-circle"></i> Nome válido
          </div>
        )}
        {errors.nomeCompleto && (
          <div className="feedback invalid">{errors.nomeCompleto}</div>
        )}
      </div>

      {/* Data de Nascimento */}
      <div className="campo-grupo">
        <label>Data de Nascimento</label>
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
        />
        {!errors.dataNascimento && formData.dataNascimento && (
          <div className="feedback valid">
            <i className="fas fa-check-circle"></i> Data válida
          </div>
        )}
        {errors.dataNascimento && (
          <div className="feedback invalid">{errors.dataNascimento}</div>
        )}
      </div>

      {/* CPF */}
      <div className="campo-grupo">
        <label>CPF</label>
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="XXX.XXX.XXX-XX"
        />
        {!errors.cpf && formData.cpf && validarCPF(formData.cpf) && (
          <div className="feedback valid">
            <i className="fas fa-check-circle"></i> CPF válido
          </div>
        )}
        {errors.cpf && <div className="feedback invalid">{errors.cpf}</div>}
      </div>

      {/* Telefone Fixo */}
      <div className="campo-grupo">
        <label>Telefone Fixo</label>
        <input
          type="text"
          name="telefoneFixo"
          value={formData.telefoneFixo}
          onChange={handleChange}
          placeholder="(XX) XXXX-XXXX"
        />
      </div>

      {/* Celular */}
      <div className="campo-grupo">
        <label>Celular</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          placeholder="(XX) 9XXXX-XXXX"
        />
      </div>

      {/* Campos para menores de idade */}
      {idade < 18 && (
        <>
          <h2>Informações Complementares (Menores de Idade)</h2>

          {/* Nome do Pai */}
          <div className="campo-grupo">
            <label>Nome do Pai</label>
            <input
              type="text"
              name="nomePai"
              value={formData.nomePai}
              onChange={handleChange}
              placeholder="Digite o nome do pai"
            />
            {!errors.nomePai && formData.nomePai && (
              <div className="feedback valid">
                <i className="fas fa-check-circle"></i> Nome válido
              </div>
            )}
            {errors.nomePai && (
              <div className="feedback invalid">{errors.nomePai}</div>
            )}
          </div>

          {/* Nome da Mãe */}
          <div className="campo-grupo">
            <label>Nome da Mãe</label>
            <input
              type="text"
              name="nomeMae"
              value={formData.nomeMae}
              onChange={handleChange}
              placeholder="Digite o nome da mãe"
            />
            {!errors.nomeMae && formData.nomeMae && (
              <div className="feedback valid">
                <i className="fas fa-check-circle"></i> Nome válido
              </div>
            )}
            {errors.nomeMae && (
              <div className="feedback invalid">{errors.nomeMae}</div>
            )}
          </div>
        </>
      )}

      {/* Endereço */}
      <h2>Endereço</h2>

      {/* CEP */}
      <div className="campo-grupo">
        <label>CEP</label>
        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="XXXXX-XXX"
        />
      </div>

      {/* Endereço */}
      <div className="campo-grupo">
        <label>Endereço</label>
        <input
          type="text"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          placeholder="Digite seu endereço"
        />
      </div>

      {/* Número */}
      <div className="campo-grupo">
        <label>Número</label>
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          placeholder="Número"
        />
      </div>

      {/* Complemento */}
      <div className="campo-grupo">
        <label>Complemento</label>
        <input
          type="text"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
          placeholder="Complemento"
        />
      </div>

      {/* Cidade */}
      <div className="campo-grupo">
        <label>Cidade</label>
        <input
          type="text"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          placeholder="Cidade"
        />
      </div>

      {/* Estado */}
      <div className="campo-grupo">
        <label>Estado</label>
        <input
          type="text"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          placeholder="Estado"
        />
      </div>

      {/* Informações da Conta */}
      <h2>Informações da Conta</h2>

      {/* Email */}
      <div className="campo-grupo">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu email"
        />
        {!errors.email && formData.email && validarEmail(formData.email) && (
          <div className="feedback valid">
            <i className="fas fa-check-circle"></i> Email válido
          </div>
        )}
        {errors.email && <div className="feedback invalid">{errors.email}</div>}
      </div>

      {/* Senha */}
      <div className="campo-grupo">
        <label>Senha</label>
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          placeholder="Digite sua senha"
        />
        {!errors.senha && formData.senha && validarSenha(formData.senha) && (
          <div className="feedback valid">
            <i className="fas fa-check-circle"></i> Senha válida
          </div>
        )}
        {errors.senha && <div className="feedback invalid">{errors.senha}</div>}
      </div>

      {/* Confirmar Senha */}
      <div className="campo-grupo">
        <label>Confirmar Senha</label>
        <input
          type="password"
          name="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleChange}
          placeholder="Confirme sua senha"
        />
        {!errors.confirmarSenha &&
          formData.confirmarSenha &&
          formData.senha === formData.confirmarSenha && (
            <div className="feedback valid">
              <i className="fas fa-check-circle"></i> Senhas coincidem
            </div>
          )}
        {errors.confirmarSenha && (
          <div className="feedback invalid">{errors.confirmarSenha}</div>
        )}
      </div>

      {/* Botão de Envio */}
      <button type="submit" className="botao-enviar">
        Enviar
      </button>

      {/* Mensagem de Sucesso */}
      {enviadoComSucesso && (
        <div className="mensagem-sucesso">
          Formulário enviado com sucesso!
        </div>
      )}
    </form>
  );
};

export default Formulario;