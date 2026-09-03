# Windows Server — Active Directory (AD DS)

> Projet personnel — Mise en place d'un environnement Active Directory avec Windows Server 2022

Ce projet a pour objectif de mettre en place un environnement **Windows Server 2022** avec **Active Directory Domain Services (AD DS)** afin de comprendre le fonctionnement d'un domaine Windows, la gestion des utilisateurs et des ordinateurs, ainsi que les bases de l'administration système et réseau.

Ce README sert également de **journal de progression** : j'y documente ce que j'ai appris, les manipulations réalisées, les problèmes rencontrés et les solutions trouvées par moi-même ou avec l'aide d'internet.

---

## 📚 Objectifs du projet

* Installer et configurer Windows Server 2022 sur VirtualBox.
* Configurer correctement une machine serveur.
* Comprendre le fonctionnement d'un réseau avec IP statique.
* Installer le rôle **Active Directory Domain Services (AD DS)**.
* Transformer/promouvoir un serveur en **Domain Controller (DC)**.
* Créer un domaine Active Directory.
* Comprendre les notions de **domaine**, **forêt**, **OU**, **utilisateur**, **groupe**, etc.
* Comprendre le rôle du **DNS** dans Active Directory.
* Administrer les utilisateurs et les ordinateurs du domaine.
* Apprendre à identifier les différents rôles et services Windows Server.
* Documenter les erreurs rencontrées et leur résolution.

---

# 🖥️ 1. Windows Server, c'est quoi ?

**Windows Server** est une version de Windows destinée principalement aux serveurs et à l'administration d'infrastructures informatiques.

Contrairement à Windows 11, par exemple, Windows Server fournit des **rôles et services réseau** permettant de gérer plusieurs machines et utilisateurs.

Exemples :

* Active Directory
* DNS
* DHCP
* Services de fichiers
* Services d'impression
* Services de certificats
* Hyper-V
* Serveur Web IIS
* Services Remote Desktop

Dans ce projet, le rôle principal utilisé est :

> **Active Directory Domain Services (AD DS)**

---

# 🏢 2. Active Directory, c'est quoi ?

**Active Directory (AD)** est un service d'annuaire développé par Microsoft permettant de centraliser la gestion des ressources d'un réseau.

Il permet notamment de gérer :

* 👤 Utilisateurs
* 💻 Ordinateurs
* 👥 Groupes
* 📁 Unités organisationnelles
* 🔐 Permissions
* 🛡️ Politiques de sécurité
* 🌐 Machines appartenant au domaine

Au lieu de configurer chaque ordinateur individuellement, un administrateur peut gérer une grande partie de l'infrastructure depuis Active Directory.

### Exemple

Sans Active Directory :

```text
PC 1 → utilisateur local
PC 2 → utilisateur local
PC 3 → utilisateur local
PC 4 → utilisateur local
```

Avec Active Directory :
> Schéma fait avec IA pour facilité de tâche d'écriture.

```text
                 DOMAIN CONTROLLER
                        │
                ┌───────┴───────┐
                │ Active Directory│
                └───────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
         PC1           PC2           PC3
          │             │             │
       User01        User02        User03
```

Les utilisateurs peuvent alors être authentifiés par le domaine.

---

# 🌐 3. Domaine Active Directory

Un **domaine** est une organisation logique regroupant des utilisateurs, ordinateurs et autres ressources administrées par Active Directory.

Exemple :

```text
entreprise.local
```

ou :

```text
ad.mondomaine.fr
```

Dans un environnement de test, on peut utiliser un nom de domaine interne tel que :

```text
lab.local
```

Un utilisateur peut alors avoir un compte comme :

```text
LAB\alice
```

ou :

```text
alice@lab.local
```

---

# 🏛️ 4. Domain Controller (DC)

## Qu'est-ce qu'un DC ?

**DC = Domain Controller**

Un **Domain Controller** est un serveur qui héberge notamment les services nécessaires à la gestion d'un domaine Active Directory.

Il permet :

* d'authentifier les utilisateurs ;
* d'authentifier les ordinateurs ;
* de stocker les informations Active Directory ;
* d'appliquer certaines politiques ;
* de gérer les comptes et groupes ;
* de fournir des services liés au domaine.

### Avant la promotion

```text
Windows Server 2022
        │
        └── Serveur classique
```

### Après la promotion

```text
Windows Server 2022
        │
        └── Domain Controller
                │
                ├── Active Directory
                ├── DNS
                └── Domaine
```

---

# ⬆️ 5. Pourquoi promouvoir un serveur en Domain Controller ?

Installer le rôle **AD DS** ne signifie pas automatiquement que le serveur est déjà un contrôleur de domaine.

La **promotion** permet de transformer le serveur en **Domain Controller** et de créer ou rejoindre une infrastructure Active Directory.

Lors de la création d'un premier domaine, le serveur devient généralement le premier DC de la nouvelle forêt.

Schématiquement :

```text
Serveur Windows
      ↓
Installation du rôle AD DS
      ↓
Promotion du serveur
      ↓
Domain Controller
      ↓
Création du domaine
```

---

# 🧩 6. AD DS : Active Directory Domain Services

**AD DS = Active Directory Domain Services**

C'est le rôle Windows Server permettant de mettre en place Active Directory.

Il fournit notamment :

* l'annuaire Active Directory ;
* l'authentification ;
* la gestion des utilisateurs ;
* la gestion des ordinateurs ;
* les groupes ;
* les unités organisationnelles ;
* l'intégration avec DNS ;
* les politiques de groupe avec Group Policy.

⚠️ À ne pas confondre avec :

**AD CS = Active Directory Certificate Services**

AD CS sert principalement à gérer une **infrastructure de certificats (PKI)**.

---

# 🔐 7. AD DS vs AD CS

| Service    | Signification                                   | Fonction                                             |
| ---------- | ----------------------------------------------- | ---------------------------------------------------- |
| **AD DS**  | Active Directory Domain Services                | Domaine, utilisateurs, ordinateurs, authentification |
| **AD CS**  | Active Directory Certificate Services           | Certificats numériques et PKI                        |
| **AD FS**  | Active Directory Federation Services            | Authentification fédérée                             |
| **AD LDS** | Active Directory Lightweight Directory Services | Annuaire LDAP sans domaine Windows classique         |

### Comment les reconnaître ?

Le nom donne déjà une indication :

```text
AD DS → Domain Services
AD CS → Certificate Services
AD FS → Federation Services
AD LDS → Lightweight Directory Services
```

Dans mon projet, le rôle recherché était :

> **Active Directory Domain Services (AD DS)**

et non :

> Active Directory Certificate Services (AD CS)

---

# 🌲 8. Forêt, arbre et domaine

Active Directory possède plusieurs niveaux d'organisation.

### Domaine

Un domaine contient des objets Active Directory :

```text
lab.local
│
├── Utilisateurs
├── Ordinateurs
├── Groupes
└── OU
```

### Arbre (Tree)

Un arbre peut regrouper plusieurs domaines ayant un espace de noms DNS lié.

Exemple :

```text
entreprise.local
│
├── paris.entreprise.local
└── lyon.entreprise.local
```

### Forêt (Forest)

Une forêt est l'ensemble logique le plus large d'Active Directory.

```text
FOREST
│
├── TREE
│    ├── domaine.local
│    └── sous.domaine.local
│
└── autre domaine
```

Dans un petit laboratoire, une seule forêt et un seul domaine sont généralement suffisants.

---

# 📁 9. OU — Organizational Unit

**OU = Organizational Unit**

Une OU permet d'organiser les objets Active Directory.

Exemple :

```text
lab.local
│
├── OU=Users
│    ├── Alice
│    └── Bob
│
├── OU=Computers
│    ├── PC-01
│    └── PC-02
│
└── OU=Servers
     └── SRV-AD01
```

Les OU sont particulièrement importantes pour appliquer des **Group Policies (GPO)**.

---

# 👤 10. Utilisateur Active Directory

Un utilisateur AD est un compte centralisé dans Active Directory.

Exemple :

```text
Nom : Alice
Login : alice
Domaine : LAB
```

Connexion :

```text
LAB\alice
```

ou :

```text
alice@lab.local
```

Un compte peut être placé dans une OU et être membre de différents groupes.

---

# 👥 11. Groupes Active Directory

Les groupes permettent de regrouper des utilisateurs ou ordinateurs.

Exemple :

```text
Groupe : IT-Admins

    ├── Alice
    ├── Bob
    └── Charlie
```

Au lieu d'attribuer une permission individuellement à chaque utilisateur, on peut attribuer la permission au groupe.

Cela facilite énormément l'administration.

---

# 🖥️ 12. Ordinateur membre du domaine

Un PC Windows peut être ajouté au domaine.

Avant :

```text
PC-01
└── Compte local
```

Après l'intégration au domaine :

```text
LAB
│
├── PC-01
├── PC-02
└── PC-03
```

Un utilisateur peut alors se connecter avec son compte de domaine.

Exemple :

```text
LAB\alice
```

---

# 🌐 13. DNS et Active Directory

**DNS = Domain Name System**

DNS permet notamment de traduire des noms en adresses IP.

Exemple :

```text
server.lab.local
        ↓
    192.168.1.10
```

DNS est **essentiel au bon fonctionnement d'Active Directory**.

Active Directory utilise notamment les enregistrements DNS pour permettre aux machines de trouver les services du domaine.

Dans un environnement AD, le DNS du poste client doit donc généralement pointer vers le DNS du contrôleur de domaine.

Exemple :

```text
DC01
IP : 192.168.1.10
DNS : 192.168.1.10
```

Puis :

```text
PC01
IP : 192.168.1.20
DNS : 192.168.1.10
```

---

# 📡 14. Pourquoi utiliser une IP statique ?

Un serveur important comme un Domain Controller doit avoir une adresse IP stable.

Exemple :

```text
DC01
IP      : 192.168.1.10
Masque  : 255.255.255.0
Gateway : 192.168.1.1
DNS     : 192.168.1.10
```

Si l'adresse du serveur change constamment, les autres machines peuvent avoir des difficultés à retrouver les services du domaine.

---

# ⚙️ 15. Configuration initiale du serveur

Avant de mettre en place Active Directory, plusieurs paramètres doivent être correctement configurés.

### Configuration réalisée

* Nom de la machine
* Adresse IP statique
* Masque réseau
* Passerelle
* DNS
* Heure/date
* Configuration administrateur

Exemple de nommage :

```text
DC01
```

Le nom permet d'identifier facilement le serveur dans l'infrastructure.

---

# 🔑 16. Administrateur

Windows Server possède différents niveaux de privilèges.

Un compte administrateur permet d'effectuer des opérations nécessitant des droits élevés.

Dans mon environnement de test, certains problèmes de configuration venaient du fait que mon compte n'avait pas les permissions nécessaires.

Le passage avec les droits administrateur m'a permis notamment de modifier :

* le nom de la machine ;
* la configuration réseau ;
* l'heure locale ;
* certains paramètres système ;
* l'installation de rôles Windows Server.

---

# 🛠️ 17. Problèmes rencontrés et solutions

Cette section sera complétée au fur et à mesure de l'avancement du projet.

---

## ❌ Problème 1 — Échec du premier lancement de la VM

La machine virtuelle Windows Server 2022 ne démarrait pas correctement lors du premier lancement.

> Cause
 Les ressources (RAM, CPU, Stockage) attribuées à la machine virtuelle étaient insuffisantes.


> Solution
 J'ai augmenté les ressources de la VM :

* davantage de RAM ;
* davantage de stockage ;
* davantage de CPU.

Après modification des ressources, la machine a pu démarrer correctement.


J'ai appris que : 

Une machine virtuelle doit disposer de ressources suffisantes pour pouvoir faire fonctionner correctement son système d'exploitation.

---

## ❌ Problème 2 — Échec de l'installation de Windows Server

L'installation de Windows Server 2022 ne se lançait pas correctement.

> Cause
 La configuration du média d'installation et de l'ordre de démarrage n'était pas correcte.

> Solution
 J'ai :

  1. utilisé l'**ISO** de Windows Server plutôt qu'un média configuré comme un DVD ;
  2. vérifié le montage de l'ISO dans VirtualBox ;
  3. configuré l'ordre de démarrage afin que le disque approprié soit pris en compte correctement au lancement.


> Ce que j'ai appris
Dans une machine virtuelle, il est important de comprendre :

* comment monter une image ISO ;
* la différence entre un disque virtuel et un média d'installation ;
* l'ordre de boot ;
* le fonctionnement du BIOS/UEFI virtuel.

---

## ❌ Problème 3 — Impossible de configurer correctement le serveur

Je rencontrais des difficultés pour modifier :

* l'adresse IP ;
* le nom du serveur ;
* l'heure locale.

> Cause
Mon compte ne possédait pas suffisamment de privilèges d'administrateur.

> Solutions
J'ai utilisé un compte disposant des droits administrateur.

J'ai ensuite pu modifier :

'''text
Nom du serveur
IP statique
Configuration réseau
Heure locale
```

> Ce que j'ai appris
Les permissions sont essentielles dans Windows Server.
Certaines modifications nécessitent des **droits administrateur**.

---

## ❌ Problème 4 — Mauvais rôle Active Directory sélectionné

Lors de l'installation du rôle Active Directory, je n'avais pas sélectionné le service correspondant à mon objectif.

> Cause
J'avais sélectionné :
 **Active Directory Certificate Services (AD CS)**

alors que je voulais mettre en place :
 **Active Directory Domain Services (AD DS)**

> Solution 
J'ai sélectionné le bon rôle :
  **Active Directory Domain Services**

J'ai ensuite poursuivi la configuration afin de préparer la promotion du serveur en Domain Controller.


> Ce que j'ai appris de cela :
Les différents rôles Active Directory ont des fonctions différentes.

AD DS → Domaine / utilisateurs / ordinateurs
AD CS → Certificats / PKI
AD FS → Fédération / authentification
AD LDS → Annuaire LDAP
```

Il est donc important d'identifier précisément le rôle nécessaire avant son installation.

---

# 🧠 18. Ce que j'ai appris jusqu'à présent

À travers ce projet, j'ai commencé à apprendre :

* l'installation de Windows Server 2022 ;
* la configuration d'une machine virtuelle ;
* la gestion des ressources d'une VM ;
* la configuration réseau d'un serveur ;
* la configuration d'une IP statique ;
* le changement du nom d'une machine ;
* la gestion des privilèges administrateur ;
* les rôles et fonctionnalités Windows Server ;
* la différence entre AD DS et AD CS ;
* le principe d'Active Directory ;
* le rôle d'un Domain Controller ;
* le principe de promotion d'un serveur ;
* l'importance du DNS dans Active Directory ;
* les bases de l'organisation d'un domaine.

---

# 🚧 19. Prochaines étapes

* [✅] Terminer la promotion du serveur en Domain Controller. (19 Juillet)
* [✅] Créer le domaine Active Directory. (19 Juillet)
* [ ] Configurer le DNS.
* [ ] Vérifier le fonctionnement du domaine.
* [ ] Créer des utilisateurs.
* [ ] Créer des groupes.
* [ ] Créer des OU.
* [ ] Ajouter une machine cliente au domaine.
* [ ] Tester une connexion avec un utilisateur du domaine.
* [ ] Mettre en place des GPO.
* [ ] Tester différentes permissions.
* [ ] Ajouter éventuellement un second contrôleur de domaine.
* [ ] Documenter les nouveaux problèmes rencontrés.

---

# 📝 20. Journal des problèmes

Cette partie sera complétée pendant le développement du projet.

| # | Problème                                | Solution                              | Statut   |
| - | --------------------------------------- | ------------------------------------- | -------- |
| 1 | VM ne démarrait pas correctement        | Augmentation RAM + stockage           | ✅ Résolu |
| 2 | Installation Windows Server impossible  | Correction ISO + ordre de boot        | ✅ Résolu |
| 3 | IP / nom / heure impossibles à modifier | Utilisation des droits administrateur | ✅ Résolu |
| 4 | Mauvais rôle Active Directory           | AD CS → AD DS                         | ✅ Résolu |
| 5 | À compléter                             | À compléter                           | ⏳        |

---

# 🎯 Conclusion

Ce projet me permet de construire progressivement un **laboratoire Windows Server / Active Directory** afin de développer mes compétences en administration système et réseau.

L'objectif n'est pas uniquement de réussir l'installation, mais également de **comprendre pourquoi chaque configuration est nécessaire**, d'identifier les erreurs et de trouver leurs solutions.

Chaque problème rencontré est donc documenté afin de garder une trace de mon apprentissage et de pouvoir expliquer les différentes étapes de mise en place de l'infrastructure.


> **Le projet sera mis à jour au fur et à mesure de mes nouvelles expérimentations, configurations et problèmes rencontrés.**
