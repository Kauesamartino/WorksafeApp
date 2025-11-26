import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type CreateUserRequest, authService, cepService } from '../../services/api';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }: RegisterScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateUserRequest>({
    nome: '',
    sobrenome: '',
    cpf: '',
    sexo: 'MASCULINO',
    email: '',
    telefone: '',
    credenciais: {
      username: '',
      password: '',
    },
    cargo: '',
    departamento: '',
    dataNascimento: '',
    endereco: {
      logradouro: '',
      bairro: '',
      cep: '',
      numero: '',
      complemento: '',
      cidade: '',
      uf: '',
    },
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayDate, setDisplayDate] = useState('');
  const [displayCpf, setDisplayCpf] = useState('');
  const [displayCep, setDisplayCep] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const validateStep1 = () => {
    if (!formData.nome.trim() || !formData.sobrenome.trim() || !formData.email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.credenciais.username.trim() || !formData.credenciais.password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha usuário e senha.');
      return false;
    }

    if (formData.credenciais.password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return false;
    }

    if (formData.credenciais.password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (formData.endereco.cep && (!formData.endereco.logradouro || !formData.endereco.cidade)) {
      Alert.alert('Erro', 'Se informar o CEP, preencha logradouro e cidade.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleRegister();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await authService.createUser(formData);
      Alert.alert(
        'Sucesso', 
        'Conta criada com sucesso! Você pode fazer login agora.',
        [{ text: 'OK', onPress: onRegisterSuccess }]
      );
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert(
        'Erro no Cadastro',
        'Não foi possível criar a conta. Verifique os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (section: keyof CreateUserRequest | 'endereco' | 'credenciais', field: string, value: string) => {
    setFormData(prev => {
      if (section === 'endereco') {
        return {
          ...prev,
          endereco: {
            ...prev.endereco,
            [field]: value,
          },
        };
      } else if (section === 'credenciais') {
        return {
          ...prev,
          credenciais: {
            ...prev.credenciais,
            [field]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  const formatDate = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Aplica a máscara DD/MM/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const formatPhone = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Aplica a máscara (11) 90000-0000
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const formatCpf = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Aplica a máscara 000.000.000-00
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
  };

  const handleCpfChange = (text: string) => {
    const formatted = formatCpf(text);
    const numbersOnly = text.replace(/\D/g, '');
    setDisplayCpf(formatted);
    setFormData(prev => ({ ...prev, cpf: numbersOnly }));
  };

  const formatCep = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Aplica a máscara 00000-000
    if (numbers.length <= 5) {
      return numbers;
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    }
  };

  const buscarDadosCep = async (cep: string) => {
    if (cep.replace(/\D/g, '').length === 8) {
      setLoadingCep(true);
      try {
        const dadosCep = await cepService.buscarCep(cep);
        setFormData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            logradouro: dadosCep.logradouro,
            bairro: dadosCep.bairro,
            cidade: dadosCep.localidade,
            uf: dadosCep.uf,
            cep: formatCep(dadosCep.cep)
          }
        }));
      } catch (error) {
        Alert.alert('Erro', 'CEP não encontrado. Verifique e tente novamente.');
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleCepChange = async (text: string) => {
    const formatted = formatCep(text);
    setDisplayCep(formatted);
    setFormData(prev => ({ ...prev, endereco: { ...prev.endereco, cep: formatted } }));
    
    // Busca dados automaticamente quando CEP estiver completo
    await buscarDadosCep(formatted);
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setDisplayDate(formatted);
    
    // Converte DD/MM/YYYY para YYYY-MM-DD para a API
    if (formatted.length === 10) {
      const [day, month, year] = formatted.split('/');
      const isoDate = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, dataNascimento: isoDate }));
    } else {
      setFormData(prev => ({ ...prev, dataNascimento: '' }));
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step ? styles.stepCircleActive : styles.stepCircleInactive
          ]}>
            <Text style={[
              styles.stepText,
              currentStep >= step ? styles.stepTextActive : styles.stepTextInactive
            ]}>
              {step}
            </Text>
          </View>
          <Text style={styles.stepLabel}>
            {step === 1 ? 'Pessoal' : step === 2 ? 'Acesso' : 'Endereço'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Dados Pessoais</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          value={formData.nome}
          onChangeText={(value) => updateFormData('nome', 'nome', value)}
          placeholder="Seu nome"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sobrenome *</Text>
        <TextInput
          style={styles.input}
          value={formData.sobrenome}
          onChangeText={(value) => updateFormData('sobrenome', 'sobrenome', value)}
          placeholder="Seu sobrenome"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => updateFormData('email', 'email', value)}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          value={displayCpf}
          onChangeText={handleCpfChange}
          placeholder="000.000.000-00"
          keyboardType="numeric"
          maxLength={14}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={formData.telefone}
          onChangeText={handlePhoneChange}
          placeholder="(11) 90000-0000"
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          value={displayDate}
          onChangeText={handleDateChange}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sexo</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, formData.sexo === 'MASCULINO' && styles.radioButtonActive]}
            onPress={() => updateFormData('sexo', 'sexo', 'MASCULINO')}
          >
            <Text style={[styles.radioText, formData.sexo === 'MASCULINO' && styles.radioTextActive]}>
              Masculino
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, formData.sexo === 'FEMININO' && styles.radioButtonActive]}
            onPress={() => updateFormData('sexo', 'sexo', 'FEMININO')}
          >
            <Text style={[styles.radioText, formData.sexo === 'FEMININO' && styles.radioTextActive]}>
              Feminino
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cargo</Text>
        <TextInput
          style={styles.input}
          value={formData.cargo}
          onChangeText={(value) => updateFormData('cargo', 'cargo', value)}
          placeholder="Seu cargo"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Departamento</Text>
        <TextInput
          style={styles.input}
          value={formData.departamento}
          onChangeText={(value) => updateFormData('departamento', 'departamento', value)}
          placeholder="Seu departamento"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Credenciais de Acesso</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome de Usuário *</Text>
        <TextInput
          style={styles.input}
          value={formData.credenciais.username}
          onChangeText={(value) => updateFormData('credenciais', 'username', value)}
          placeholder="Seu nome de usuário"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha *</Text>
        <TextInput
          style={styles.input}
          value={formData.credenciais.password}
          onChangeText={(value) => updateFormData('credenciais', 'password', value)}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar Senha *</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repita sua senha"
          secureTextEntry
        />
      </View>

      <View style={styles.passwordHints}>
        <Text style={styles.hintTitle}>Sua senha deve ter:</Text>
        <Text style={styles.hint}>• Pelo menos 6 caracteres</Text>
        <Text style={styles.hint}>• Letras e números (recomendado)</Text>
        <Text style={styles.hint}>• Caracteres especiais (recomendado)</Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Endereço (Opcional)</Text>
      
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>CEP</Text>
          {loadingCep && <Text style={styles.loadingText}>Buscando...</Text>}
        </View>
        <TextInput
          style={[styles.input, loadingCep && styles.inputLoading]}
          value={displayCep}
          onChangeText={handleCepChange}
          placeholder="00000-000"
          keyboardType="numeric"
          maxLength={9}
          editable={!loadingCep}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Logradouro</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco.logradouro}
          onChangeText={(value) => updateFormData('endereco', 'logradouro', value)}
          placeholder="Rua, avenida, etc."
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco.numero}
            onChangeText={(value) => updateFormData('endereco', 'numero', value)}
            placeholder="123"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.inputGroup, styles.flex2]}>
          <Text style={styles.label}>Complemento</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco.complemento}
            onChangeText={(value) => updateFormData('endereco', 'complemento', value)}
            placeholder="Apto, bloco, etc."
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco.bairro}
          onChangeText={(value) => updateFormData('endereco', 'bairro', value)}
          placeholder="Seu bairro"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex2]}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco.cidade}
            onChangeText={(value) => updateFormData('endereco', 'cidade', value)}
            placeholder="Sua cidade"
          />
        </View>
        <View style={[styles.inputGroup, styles.flex1]}>
          <Text style={styles.label}>UF</Text>
          <TextInput
            style={styles.input}
            value={formData.endereco.uf}
            onChangeText={(value) => updateFormData('endereco', 'uf', value.toUpperCase())}
            placeholder="SP"
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <View style={styles.finalNote}>
        <Text style={styles.noteText}>
          Pronto! Clique em "Finalizar" para criar sua conta.
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep1();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Etapa {currentStep} de 3</Text>
        </View>

        {renderStepIndicator()}

        {renderCurrentStep()}

        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Ionicons name="arrow-back" size={20} color="#6B7280" />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.nextButton, loading && styles.buttonDisabled]}
            onPress={nextStep}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>
              {loading 
                ? 'Criando...' 
                : currentStep === 3 
                  ? 'Finalizar' 
                  : 'Próximo'
              }
            </Text>
            {currentStep < 3 && !loading && (
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={onNavigateToLogin}
        >
          <Text style={styles.linkText}>
            Já tem uma conta? Faça login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 90,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#2563EB',
  },
  stepCircleInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  stepTextInactive: {
    color: '#9CA3AF',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  stepContent: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  radioButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  radioText: {
    fontSize: 14,
    color: '#374151',
  },
  radioTextActive: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  passwordHints: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  finalNote: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginTop: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#1D4ED8',
    textAlign: 'center',
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingText: {
    fontSize: 12,
    color: '#2563EB',
    fontStyle: 'italic',
  },
  inputLoading: {
    backgroundColor: '#F3F4F6',
    opacity: 0.8,
  },
});
