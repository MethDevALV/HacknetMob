
export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<string, Translation> = {
  es: {
    common: {
      yes: 'Sí',
      no: 'No',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      load: 'Cargar',
      delete: 'Eliminar',
      back: 'Atrás',
      next: 'Siguiente',
      close: 'Cerrar',
      settings: 'Configuración',
      help: 'Ayuda'
    },
    terminal: {
      welcome: 'HACKNET MOBILE v3.0.0 - TERMINAL LISTO',
      connected: 'Conectado a: {node}',
      helpText: 'Escribe "help" para ver comandos disponibles',
      commandNotFound: 'Comando no encontrado: {command}',
      processing: 'Procesando...',
      gestures: 'Desliza derecha: autocompletar • Desliza izquierda: limpiar • Desliza arriba/abajo: historial'
    },
    commands: {
      help: {
        description: 'Muestra esta ayuda',
        usage: 'help [comando]'
      },
      scan: {
        description: 'Escanea la red local en busca de dispositivos',
        usage: 'scan'
      },
      probe: {
        description: 'Analiza un nodo específico',
        usage: 'probe <IP>'
      },
      connect: {
        description: 'Conecta a un nodo remoto',
        usage: 'connect <IP>'
      },
      disconnect: {
        description: 'Desconecta del nodo actual',
        usage: 'disconnect'
      },
      ls: {
        description: 'Lista archivos y directorios',
        usage: 'ls [directorio]'
      },
      cd: {
        description: 'Cambia de directorio',
        usage: 'cd <directorio>'
      },
      cat: {
        description: 'Muestra el contenido de un archivo',
        usage: 'cat <archivo>'
      },
      pwd: {
        description: 'Muestra el directorio actual',
        usage: 'pwd'
      },
      clear: {
        description: 'Limpia la terminal',
        usage: 'clear'
      },
      sshcrack: {
        description: 'Ataca vulnerabilidades SSH',
        usage: 'sshcrack <IP>'
      },
      ftpbounce: {
        description: 'Explota vulnerabilidades FTP',
        usage: 'ftpbounce <IP>'
      },
      webserverworm: {
        description: 'Ataca servidores web',
        usage: 'webserverworm <IP>'
      },
      porthack: {
        description: 'Herramienta universal de explotación',
        usage: 'porthack <IP>'
      },
      whoami: {
        description: 'Muestra información del usuario actual',
        usage: 'whoami'
      },
      ps: {
        description: 'Muestra procesos en ejecución',
        usage: 'ps'
      },
      netstat: {
        description: 'Muestra conexiones de red activas',
        usage: 'netstat'
      }
    },
    network: {
      title: 'MAPA DE RED',
      discovered: 'Descubiertos: {count} dispositivos',
      currentNode: 'Nodo Actual: {node}',
      scanRequired: 'Escaneo de red requerido',
      scanHint: 'Usa el comando "scan" para descubrir dispositivos cercanos',
      compromised: 'COMPROMETIDO',
      secured: 'ASEGURADO',
      connecting: 'CONECTANDO...',
      statistics: 'ESTADÍSTICAS DE RED',
      viewMode: 'Vista',
      graphical: 'Gráfica',
      list: 'Lista'
    },
    missions: {
      title: 'MISIONES',
      active: 'Activas: {count}',
      completed: 'Completadas: {count}',
      claimed: 'Reclamadas: {count}',
      briefing: 'INFORMACIÓN DE MISIÓN',
      objective: 'Objetivo:',
      reward: 'Recompensa: ${amount}',
      accept: 'ACEPTAR',
      abandon: 'ABANDONAR',
      claim: 'RECLAMAR RECOMPENSA',
      rewardClaimed: 'RECOMPENSA RECLAMADA'
    },
    intrusion: {
      detected: 'INTRUSIÓN DETECTADA',
      target: 'Objetivo: {target}',
      security: 'Seguridad: {level}',
      timeRemaining: 'Tiempo restante: {time}',
      termination: 'LA CONEXIÓN SERÁ TERMINADA EN {seconds} SEGUNDOS!'
    },
    resources: {
      cpu: 'CPU',
      ram: 'RAM',
      network: 'RED',
      storage: 'ALMACENAMIENTO',
      temperature: 'TEMPERATURA',
      trace: 'RASTREO'
    },
    settings: {
      title: 'CONFIGURACIÓN',
      audio: 'Audio',
      language: 'Idioma',
      game: 'Partida',
      patches: 'Actualizaciones'
    }
  },
  en: {
    common: {
      yes: 'Yes',
      no: 'No',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      load: 'Load',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      close: 'Close',
      settings: 'Settings',
      help: 'Help'
    },
    terminal: {
      welcome: 'HACKNET MOBILE v3.0.0 - TERMINAL READY',
      connected: 'Connected to: {node}',
      helpText: 'Type "help" for available commands',
      commandNotFound: 'Command not found: {command}',
      processing: 'Processing...',
      gestures: 'Swipe right: autocomplete • Swipe left: clear • Swipe up/down: history'
    },
    commands: {
      help: {
        description: 'Shows this help',
        usage: 'help [command]'
      },
      scan: {
        description: 'Scans local network for devices',
        usage: 'scan'
      },
      probe: {
        description: 'Analyzes a specific node',
        usage: 'probe <IP>'
      },
      connect: {
        description: 'Connects to a remote node',
        usage: 'connect <IP>'
      },
      disconnect: {
        description: 'Disconnects from current node',
        usage: 'disconnect'
      },
      ls: {
        description: 'Lists files and directories',
        usage: 'ls [directory]'
      },
      cd: {
        description: 'Changes directory',
        usage: 'cd <directory>'
      },
      cat: {
        description: 'Shows file contents',
        usage: 'cat <file>'
      },
      pwd: {
        description: 'Shows current directory',
        usage: 'pwd'
      },
      clear: {
        description: 'Clears the terminal',
        usage: 'clear'
      },
      sshcrack: {
        description: 'Attacks SSH vulnerabilities',
        usage: 'sshcrack <IP>'
      },
      ftpbounce: {
        description: 'Exploits FTP vulnerabilities',
        usage: 'ftpbounce <IP>'
      },
      webserverworm: {
        description: 'Attacks web servers',
        usage: 'webserverworm <IP>'
      },
      porthack: {
        description: 'Universal exploitation tool',
        usage: 'porthack <IP>'
      },
      whoami: {
        description: 'Shows current user information',
        usage: 'whoami'
      },
      ps: {
        description: 'Shows running processes',
        usage: 'ps'
      },
      netstat: {
        description: 'Shows active network connections',
        usage: 'netstat'
      }
    },
    network: {
      title: 'NETWORK MAP',
      discovered: 'Discovered: {count} devices',
      currentNode: 'Current Node: {node}',
      scanRequired: 'Network scan required',
      scanHint: 'Use "scan" command to discover nearby devices',
      compromised: 'COMPROMISED',
      secured: 'SECURED',
      connecting: 'CONNECTING...',
      statistics: 'NETWORK STATISTICS',
      viewMode: 'View',
      graphical: 'Graphical',
      list: 'List'
    },
    missions: {
      title: 'MISSIONS',
      active: 'Active: {count}',
      completed: 'Completed: {count}',
      claimed: 'Claimed: {count}',
      briefing: 'MISSION BRIEFING',
      objective: 'Objective:',
      reward: 'Reward: ${amount}',
      accept: 'ACCEPT',
      abandon: 'ABANDON',
      claim: 'CLAIM REWARD',
      rewardClaimed: 'REWARD CLAIMED'
    },
    intrusion: {
      detected: 'INTRUSION DETECTED',
      target: 'Target: {target}',
      security: 'Security: {level}',
      timeRemaining: 'Time remaining: {time}',
      termination: 'CONNECTION WILL BE TERMINATED IN {seconds} SECONDS!'
    },
    resources: {
      cpu: 'CPU',
      ram: 'RAM',
      network: 'NETWORK',
      storage: 'STORAGE',
      temperature: 'TEMPERATURE',
      trace: 'TRACE'
    },
    settings: {
      title: 'SETTINGS',
      audio: 'Audio',
      language: 'Language',
      game: 'Game',
      patches: 'Updates'
    }
  },
  fr: {
    common: {
      yes: 'Oui',
      no: 'Non',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Sauvegarder',
      load: 'Charger',
      delete: 'Supprimer',
      back: 'Retour',
      next: 'Suivant',
      close: 'Fermer',
      settings: 'Paramètres',
      help: 'Aide'
    },
    terminal: {
      welcome: 'HACKNET MOBILE v3.0.0 - TERMINAL PRÊT',
      connected: 'Connecté à: {node}',
      helpText: 'Tapez "help" pour les commandes disponibles',
      commandNotFound: 'Commande introuvable: {command}',
      processing: 'Traitement...',
      gestures: 'Glisser droite: complétion • Glisser gauche: effacer • Glisser haut/bas: historique'
    },
    commands: {
      help: {
        description: 'Affiche cette aide',
        usage: 'help [commande]'
      },
      scan: {
        description: 'Scanne le réseau local pour les périphériques',
        usage: 'scan'
      },
      probe: {
        description: 'Analyse un nœud spécifique',
        usage: 'probe <IP>'
      },
      connect: {
        description: 'Se connecte à un nœud distant',
        usage: 'connect <IP>'
      },
      disconnect: {
        description: 'Se déconnecte du nœud actuel',
        usage: 'disconnect'
      },
      ls: {
        description: 'Liste les fichiers et répertoires',
        usage: 'ls [répertoire]'
      },
      cd: {
        description: 'Change de répertoire',
        usage: 'cd <répertoire>'
      },
      cat: {
        description: 'Affiche le contenu du fichier',
        usage: 'cat <fichier>'
      },
      pwd: {
        description: 'Affiche le répertoire actuel',
        usage: 'pwd'
      },
      clear: {
        description: 'Efface le terminal',
        usage: 'clear'
      },
      sshcrack: {
        description: 'Attaque les vulnérabilités SSH',
        usage: 'sshcrack <IP>'
      },
      ftpbounce: {
        description: 'Exploite les vulnérabilités FTP',
        usage: 'ftpbounce <IP>'
      },
      webserverworm: {
        description: 'Attaque les serveurs web',
        usage: 'webserverworm <IP>'
      },
      porthack: {
        description: 'Outil d\'exploitation universel',
        usage: 'porthack <IP>'
      },
      whoami: {
        description: 'Affiche les informations utilisateur',
        usage: 'whoami'
      },
      ps: {
        description: 'Affiche les processus en cours',
        usage: 'ps'
      },
      netstat: {
        description: 'Affiche les connexions réseau actives',
        usage: 'netstat'
      }
    },
    network: {
      title: 'CARTE RÉSEAU',
      discovered: 'Découverts: {count} périphériques',
      currentNode: 'Nœud Actuel: {node}',
      scanRequired: 'Scan réseau requis',
      scanHint: 'Utilisez la commande "scan" pour découvrir les périphériques proches',
      compromised: 'COMPROMIS',
      secured: 'SÉCURISÉ',
      connecting: 'CONNEXION...',
      statistics: 'STATISTIQUES RÉSEAU',
      viewMode: 'Vue',
      graphical: 'Graphique',
      list: 'Liste'
    },
    missions: {
      title: 'MISSIONS',
      active: 'Actives: {count}',
      completed: 'Terminées: {count}',
      claimed: 'Réclamées: {count}',
      briefing: 'BRIEFING DE MISSION',
      objective: 'Objectif:',
      reward: 'Récompense: {amount}€',
      accept: 'ACCEPTER',
      abandon: 'ABANDONNER',
      claim: 'RÉCLAMER RÉCOMPENSE',
      rewardClaimed: 'RÉCOMPENSE RÉCLAMÉE'
    },
    intrusion: {
      detected: 'INTRUSION DÉTECTÉE',
      target: 'Cible: {target}',
      security: 'Sécurité: {level}',
      timeRemaining: 'Temps restant: {time}',
      termination: 'LA CONNEXION SERA TERMINÉE DANS {seconds} SECONDES!'
    },
    resources: {
      cpu: 'CPU',
      ram: 'RAM',
      network: 'RÉSEAU',
      storage: 'STOCKAGE',
      temperature: 'TEMPÉRATURE',
      trace: 'TRACE'
    },
    settings: {
      title: 'PARAMÈTRES',
      audio: 'Audio',
      language: 'Langue',
      game: 'Jeu',
      patches: 'Mises à jour'
    }
  },
  de: {
    common: {
      yes: 'Ja',
      no: 'Nein',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      load: 'Laden',
      delete: 'Löschen',
      back: 'Zurück',
      next: 'Weiter',
      close: 'Schließen',
      settings: 'Einstellungen',
      help: 'Hilfe'
    },
    terminal: {
      welcome: 'HACKNET MOBILE v3.0.0 - TERMINAL BEREIT',
      connected: 'Verbunden mit: {node}',
      helpText: 'Geben Sie "help" für verfügbare Befehle ein',
      commandNotFound: 'Befehl nicht gefunden: {command}',
      processing: 'Verarbeitung...',
      gestures: 'Rechts wischen: Vervollständigung • Links wischen: löschen • Hoch/runter wischen: Verlauf'
    },
    commands: {
      help: {
        description: 'Zeigt diese Hilfe',
        usage: 'help [befehl]'
      },
      scan: {
        description: 'Scannt lokales Netzwerk nach Geräten',
        usage: 'scan'
      },
      probe: {
        description: 'Analysiert einen spezifischen Knoten',
        usage: 'probe <IP>'
      },
      connect: {
        description: 'Verbindet zu einem entfernten Knoten',
        usage: 'connect <IP>'
      },
      disconnect: {
        description: 'Trennt vom aktuellen Knoten',
        usage: 'disconnect'
      },
      ls: {
        description: 'Listet Dateien und Verzeichnisse',
        usage: 'ls [verzeichnis]'
      },
      cd: {
        description: 'Wechselt Verzeichnis',
        usage: 'cd <verzeichnis>'
      },
      cat: {
        description: 'Zeigt Dateiinhalt',
        usage: 'cat <datei>'
      },
      pwd: {
        description: 'Zeigt aktuelles Verzeichnis',
        usage: 'pwd'
      },
      clear: {
        description: 'Löscht das Terminal',
        usage: 'clear'
      },
      sshcrack: {
        description: 'Greift SSH-Schwachstellen an',
        usage: 'sshcrack <IP>'
      },
      ftpbounce: {
        description: 'Nutzt FTP-Schwachstellen aus',
        usage: 'ftpbounce <IP>'
      },
      webserverworm: {
        description: 'Greift Webserver an',
        usage: 'webserverworm <IP>'
      },
      porthack: {
        description: 'Universelles Exploit-Tool',
        usage: 'porthack <IP>'
      },
      whoami: {
        description: 'Zeigt aktuelle Benutzerinformationen',
        usage: 'whoami'
      },
      ps: {
        description: 'Zeigt laufende Prozesse',
        usage: 'ps'
      },
      netstat: {
        description: 'Zeigt aktive Netzwerkverbindungen',
        usage: 'netstat'
      }
    },
    network: {
      title: 'NETZWERKKARTE',
      discovered: 'Entdeckt: {count} Geräte',
      currentNode: 'Aktueller Knoten: {node}',
      scanRequired: 'Netzwerk-Scan erforderlich',
      scanHint: 'Verwenden Sie den "scan" Befehl um nahe Geräte zu entdecken',
      compromised: 'KOMPROMITTIERT',
      secured: 'GESICHERT',
      connecting: 'VERBINDE...',
      statistics: 'NETZWERK-STATISTIKEN',
      viewMode: 'Ansicht',
      graphical: 'Grafisch',
      list: 'Liste'
    },
    missions: {
      title: 'MISSIONEN',
      active: 'Aktiv: {count}',
      completed: 'Abgeschlossen: {count}',
      claimed: 'Eingefordert: {count}',
      briefing: 'MISSIONS-BRIEFING',
      objective: 'Ziel:',
      reward: 'Belohnung: {amount}€',
      accept: 'AKZEPTIEREN',
      abandon: 'AUFGEBEN',
      claim: 'BELOHNUNG EINFORDERN',
      rewardClaimed: 'BELOHNUNG EINGEFORDERT'
    },
    intrusion: {
      detected: 'EINDRINGEN ERKANNT',
      target: 'Ziel: {target}',
      security: 'Sicherheit: {level}',
      timeRemaining: 'Verbleibende Zeit: {time}',
      termination: 'VERBINDUNG WIRD IN {seconds} SEKUNDEN BEENDET!'
    },
    resources: {
      cpu: 'CPU',
      ram: 'RAM',
      network: 'NETZWERK',
      storage: 'SPEICHER',
      temperature: 'TEMPERATUR',
      trace: 'VERFOLGUNG'
    },
    settings: {
      title: 'EINSTELLUNGEN',
      audio: 'Audio',
      language: 'Sprache',
      game: 'Spiel',
      patches: 'Updates'
    }
  },
  pt: {
    common: {
      yes: 'Sim',
      no: 'Não',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Salvar',
      load: 'Carregar',
      delete: 'Excluir',
      back: 'Voltar',
      next: 'Próximo',
      close: 'Fechar',
      settings: 'Configurações',
      help: 'Ajuda'
    },
    terminal: {
      welcome: 'HACKNET MOBILE v3.0.0 - TERMINAL PRONTO',
      connected: 'Conectado a: {node}',
      helpText: 'Digite "help" para comandos disponíveis',
      commandNotFound: 'Comando não encontrado: {command}',
      processing: 'Processando...',
      gestures: 'Deslizar direita: autocompletar • Deslizar esquerda: limpar • Deslizar cima/baixo: histórico'
    },
    commands: {
      help: {
        description: 'Mostra esta ajuda',
        usage: 'help [comando]'
      },
      scan: {
        description: 'Escaneia rede local por dispositivos',
        usage: 'scan'
      },
      probe: {
        description: 'Analisa um nó específico',
        usage: 'probe <IP>'
      },
      connect: {
        description: 'Conecta a um nó remoto',
        usage: 'connect <IP>'
      },
      disconnect: {
        description: 'Desconecta do nó atual',
        usage: 'disconnect'
      },
      ls: {
        description: 'Lista arquivos e diretórios',
        usage: 'ls [diretório]'
      },
      cd: {
        description: 'Muda diretório',
        usage: 'cd <diretório>'
      },
      cat: {
        description: 'Mostra conteúdo do arquivo',
        usage: 'cat <arquivo>'
      },
      pwd: {
        description: 'Mostra diretório atual',
        usage: 'pwd'
      },
      clear: {
        description: 'Limpa o terminal',
        usage: 'clear'
      },
      sshcrack: {
        description: 'Ataca vulnerabilidades SSH',
        usage: 'sshcrack <IP>'
      },
      ftpbounce: {
        description: 'Explora vulnerabilidades FTP',
        usage: 'ftpbounce <IP>'
      },
      webserverworm: {
        description: 'Ataca servidores web',
        usage: 'webserverworm <IP>'
      },
      porthack: {
        description: 'Ferramenta universal de exploração',
        usage: 'porthack <IP>'
      },
      whoami: {
        description: 'Mostra informações do usuário atual',
        usage: 'whoami'
      },
      ps: {
        description: 'Mostra processos em execução',
        usage: 'ps'
      },
      netstat: {
        description: 'Mostra conexões de rede ativas',
        usage: 'netstat'
      }
    },
    network: {
      title: 'MAPA DE REDE',
      discovered: 'Descobertos: {count} dispositivos',
      currentNode: 'Nó Atual: {node}',
      scanRequired: 'Escaneamento de rede necessário',
      scanHint: 'Use o comando "scan" para descobrir dispositivos próximos',
      compromised: 'COMPROMETIDO',
      secured: 'SEGURO',
      connecting: 'CONECTANDO...',
      statistics: 'ESTATÍSTICAS DE REDE',
      viewMode: 'Visualização',
      graphical: 'Gráfica',
      list: 'Lista'
    },
    missions: {
      title: 'MISSÕES',
      active: 'Ativas: {count}',
      completed: 'Concluídas: {count}',
      claimed: 'Reivindicadas: {count}',
      briefing: 'BRIEFING DA MISSÃO',
      objective: 'Objetivo:',
      reward: 'Recompensa: R${amount}',
      accept: 'ACEITAR',
      abandon: 'ABANDONAR',
      claim: 'REIVINDICAR RECOMPENSA',
      rewardClaimed: 'RECOMPENSA REIVINDICADA'
    },
    intrusion: {
      detected: 'INTRUSÃO DETECTADA',
      target: 'Alvo: {target}',
      security: 'Segurança: {level}',
      timeRemaining: 'Tempo restante: {time}',
      termination: 'CONEXÃO SERÁ TERMINADA EM {seconds} SEGUNDOS!'
    },
    resources: {
      cpu: 'CPU',
      ram: 'RAM',
      network: 'REDE',
      storage: 'ARMAZENAMENTO',
      temperature: 'TEMPERATURA',
      trace: 'RASTREAMENTO'
    },
    settings: {
      title: 'CONFIGURAÇÕES',
      audio: 'Áudio',
      language: 'Idioma',
      game: 'Jogo',
      patches: 'Atualizações'
    }
  },
  it: {
    common: {
      yes: 'Sì',
      no: 'No',
      cancel: 'Annulla',
      confirm: 'Conferma',
      save: 'Salva',
      load: 'Carica',
      delete: 'Elimina',
      back: 'Indietro',
      next: 'Avanti',
      close: 'Chiudi',
      settings: 'Impostazioni',
      help: 'Aiuto'
    },
    terminal: {
      welcome: 'HACKNET MOBILE v3.0.0 - TERMINALE PRONTO',
      connected: 'Connesso a: {node}',
      helpText: 'Digita "help" per i comandi disponibili',
      commandNotFound: 'Comando non trovato: {command}',
      processing: 'Elaborazione...',
      gestures: 'Scorri destra: completamento • Scorri sinistra: cancella • Scorri su/giù: cronologia'
    },
    commands: {
      help: {
        description: 'Mostra questo aiuto',
        usage: 'help [comando]'
      },
      scan: {
        description: 'Scansiona la rete locale per dispositivi',
        usage: 'scan'
      },
      probe: {
        description: 'Analizza un nodo specifico',
        usage: 'probe <IP>'
      },
      connect: {
        description: 'Connette a un nodo remoto',
        usage: 'connect <IP>'
      },
      disconnect: {
        description: 'Disconnette dal nodo attuale',
        usage: 'disconnect'
      },
      ls: {
        description: 'Elenca file e directory',
        usage: 'ls [directory]'
      },
      cd: {
        description: 'Cambia directory',
        usage: 'cd <directory>'
      },
      cat: {
        description: 'Mostra contenuto file',
        usage: 'cat <file>'
      },
      pwd: {
        description: 'Mostra directory attuale',
        usage: 'pwd'
      },
      clear: {
        description: 'Pulisce il terminale',
        usage: 'clear'
      },
      sshcrack: {
        description: 'Attacca vulnerabilità SSH',
        usage: 'sshcrack <IP>'
      },
      ftpbounce: {
        description: 'Sfrutta vulnerabilità FTP',
        usage: 'ftpbounce <IP>'
      },
      webserverworm: {
        description: 'Attacca server web',
        usage: 'webserverworm <IP>'
      },
      porthack: {
        description: 'Strumento di exploit universale',
        usage: 'porthack <IP>'
      },
      whoami: {
        description: 'Mostra informazioni utente attuale',
        usage: 'whoami'
      },
      ps: {
        description: 'Mostra processi in esecuzione',
        usage: 'ps'
      },
      netstat: {
        description: 'Mostra connessioni di rete attive',
        usage: 'netstat'
      }
    },
    network: {
      title: 'MAPPA DI RETE',
      discovered: 'Scoperti: {count} dispositivi',
      currentNode: 'Nodo Attuale: {node}',
      scanRequired: 'Scansione di rete richiesta',
      scanHint: 'Usa il comando "scan" per scoprire dispositivi vicini',
      compromised: 'COMPROMESSO',
      secured: 'PROTETTO',
      connecting: 'CONNESSIONE...',
      statistics: 'STATISTICHE DI RETE',
      viewMode: 'Vista',
      graphical: 'Grafica',
      list: 'Lista'
    },
    missions: {
      title: 'MISSIONI',
      active: 'Attive: {count}',
      completed: 'Completate: {count}',
      claimed: 'Riscattate: {count}',
      briefing: 'BRIEFING MISSIONE',
      objective: 'Obiettivo:',
      reward: 'Ricompensa: €{amount}',
      accept: 'ACCETTA',
      abandon: 'ABBANDONA',
      claim: 'RISCATTA RICOMPENSA',
      rewardClaimed: 'RICOMPENSA RISCATTATA'
    },
    intrusion: {
      detected: 'INTRUSIONE RILEVATA',
      target: 'Obiettivo: {target}',
      security: 'Sicurezza: {level}',
      timeRemaining: 'Tempo rimanente: {time}',
      termination: 'LA CONNESSIONE SARÀ TERMINATA TRA {seconds} SECONDI!'
    },
    resources: {
      cpu: 'CPU',
      ram: 'RAM',
      network: 'RETE',
      storage: 'ARCHIVIAZIONE',
      temperature: 'TEMPERATURA',
      trace: 'TRACCIAMENTO'
    },
    settings: {
      title: 'IMPOSTAZIONI',
      audio: 'Audio',
      language: 'Lingua',
      game: 'Gioco',
      patches: 'Aggiornamenti'
    }
  }
};

let currentLanguage = 'es';

export const setLanguage = (lang: string) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('hacknet-language', lang);
  }
};

export const getCurrentLanguage = () => {
  return currentLanguage;
};

export const initializeLanguage = () => {
  const savedLang = localStorage.getItem('hacknet-language');
  if (savedLang && translations[savedLang]) {
    currentLanguage = savedLang;
  }
};

export const t = (key: string, params?: Record<string, string | number>): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations['en'];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found in any language
        }
      }
      break;
    }
  }
  
  if (typeof value === 'string') {
    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    return value;
  }
  
  return key;
};
