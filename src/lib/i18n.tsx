import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Lang = "fr" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.about": { fr: "Qui sommes-nous", en: "Who we are" },
  "nav.about.all": { fr: "À Propos", en: "About" },
  "nav.about.index": { fr: "À Propos", en: "About" },
  "nav.about.history": { fr: "Histoire", en: "History" },
  "nav.about.values": { fr: "Valeurs", en: "Values" },
  "nav.about.join": { fr: "Devenir AfricTivistes", en: "Become an AfricTivist" },
  "nav.projects": { fr: "Axes d'interventions", en: "Areas of Intervention" },
  "nav.projects.all": { fr: "Tous les axes", en: "All areas" },
  "nav.projects.innovation": { fr: "Innovation Technologique et Participation Citoyenne", en: "Technological Innovation and Citizen Participation" },
  "nav.projects.democracy": { fr: "Élections, Démocratie et Gouvernance", en: "Elections, Democracy and Governance" },
  "nav.projects.engagement": { fr: "Engagement Citoyen et Renforcement du Réseau Panafricain", en: "Citizen Engagement and Pan-African Network Strengthening" },
  "nav.projects.media": { fr: "Médias et Résilience Informationnelle", en: "Media and Informational Resilience" },
  "nav.projects.training": { fr: "Formation, Recherche et Documentation", en: "Training, Research and Documentation" },
  "nav.resources": { fr: "Ressources", en: "Resources" },
  "nav.resources.publications": { fr: "Publications", en: "Publications" },
  "nav.resources.toolkits": { fr: "Boîtes à outils", en: "Toolkits" },
  "nav.resources.media": { fr: "Vidéothèque", en: "Video Library" },
  "nav.resources.presskit": { fr: "Espace presse", en: "Press Room" },
  "media.heroDesc": {
    fr: "Découvrez nos dernières vidéos, reportages et contenus multimédias sur la démocratie numérique en Afrique.",
    en: "Discover our latest videos, reports and multimedia content on digital democracy in Africa.",
  },
  "media.featured": { fr: "À la une", en: "Featured" },
  "media.allVideos": { fr: "Toutes les vidéos", en: "All videos" },
  "media.all": { fr: "Tout", en: "All" },
  "media.watchOnYt": { fr: "Voir sur YouTube", en: "Watch on YouTube" },
  "media.play": { fr: "Lire la vidéo", en: "Play video" },
  "media.noVideos": {
    fr: "Aucune vidéo disponible pour le moment.",
    en: "No videos available at the moment.",
  },
  "nav.news": { fr: "Actualités", en: "News" },
  "nav.news.all": { fr: "Tous les articles", en: "All articles" },
  "nav.news.communiques": { fr: "Communiqués", en: "Press releases" },
  "nav.news.plaidoyers": { fr: "Plaidoyers", en: "Advocacy" },
  "nav.news.actualites": { fr: "Actualités", en: "News" },
  "nav.news.contributions": { fr: "Contributions", en: "Contributions" },
  "nav.news.champions": { fr: "Champions", en: "Champions" },
  "nav.contact": { fr: "Contact", en: "Contact" },
  "nav.engage": { fr: "S'engager", en: "Get involved" },

  "hero.badge": { fr: "Démocratie numérique en Afrique", en: "Digital democracy in Africa" },
  "hero.title1": { fr: "Construire une ", en: "Building " },
  "hero.highlight": { fr: "citoyenneté active", en: "active citizenship" },
  "hero.title2": { fr: " à l'ère du numérique", en: " in the digital age" },
  "hero.desc": {
    fr: "AfricTivistes mobilise les citoyens, les blogueurs et les activistes du web pour renforcer la démocratie, la gouvernance et le développement en Afrique.",
    en: "AfricTivistes mobilizes citizens, bloggers and web activists to strengthen democracy, governance and development in Africa.",
  },
  "hero.cta1": { fr: "Découvrir nos initiatives", en: "Discover our initiatives" },
  "hero.cta2": { fr: "Voir les actualités", en: "View news" },

  "ticker.label": { fr: "A la une", en: "Headlines" },

  "programmes.title": { fr: "Nos projets", en: "Our projects" },
  "programmes.all": { fr: "Tous", en: "All" },

  "programmes.viewAll": { fr: "Voir tous les projets", en: "View all projects" },
  "programmes.none": { fr: "Aucun projet dans cette catégorie.", en: "No projects in this category." },
  "programmes.subtitle": {
    fr: "Axes d'interventions et initiatives pour une Afrique numérique, démocratique et inclusive.",
    en: "Areas of intervention and initiatives for a digital, democratic and inclusive Africa.",
  },

  "projet.back": { fr: "Retour aux initiatives", en: "Back to initiatives" },
  "projet.notFound": { fr: "Projet non trouvé", en: "Project not found" },
  "projet.notFoundDesc": {
    fr: "Le projet que vous recherchez n'existe pas ou a été déplacé.",
    en: "The project you are looking for does not exist or has been moved.",
  },
  "projet.thematique": { fr: "Thématique", en: "Theme" },
  "projet.label": { fr: "Étiquette", en: "Label" },
  "projet.presentation": { fr: "Présentation", en: "Overview" },
  "projet.similarTitle": { fr: "Projets connexes", en: "Related projects" },
  "projet.similarDesc": {
    fr: "Découvrez d'autres projets liés à cette thématique.",
    en: "Discover other projects related to this theme.",
  },
  "projet.viewAll": { fr: "Voir tous les projets", en: "View all projects" },
  "projet.objectives": { fr: "Objectif(s)", en: "Objective(s)" },
  "projet.participants": { fr: "Personnes formées", en: "People trained" },
  "projet.countries": { fr: "Pays", en: "Countries" },
  "country.panafricain": { fr: "Panafricain", en: "Pan-African" },
  "projet.partners": { fr: "Partenaires impliqués", en: "Partners involved" },
  "projet.activities": { fr: "Activités réalisées", en: "Activities completed" },
  "projet.resources": { fr: "Ressources produites", en: "Resources produced" },
  "projet.website": { fr: "Site web", en: "Website" },
  "projet.projectBy": { fr: "Un projet", en: "A project by" },
  "projet.supportedBy": { fr: "Soutenu par", en: "Supported by" },
  "projet.partnersWith": { fr: "En partenariat avec", en: "In partnership with" },
  "projet.progress": { fr: "Avancement du projet", en: "Project progress" },
  "projet.description": { fr: "Description", en: "Description" },
  "projet.context": { fr: "Contexte", en: "Context" },
  "projet.approach": { fr: "Approche", en: "Approach" },
  "projet.actions": { fr: "Actions", en: "Actions" },

  "projet.manager": { fr: "Responsable du projet", en: "Project manager" },
  "projet.seeDetails": { fr: "Voir le détail", en: "See details" },
  "projet.startDate": { fr: "Date de début", en: "Start date" },
  "projet.endDate": { fr: "Date de fin", en: "End date" },
  "projet.status.active": { fr: "En cours", en: "Active" },
  "projet.status.completed": { fr: "Terminé", en: "Completed" },
  "projet.status.upcoming": { fr: "À venir", en: "Upcoming" },
  "projet.keyFigures": { fr: "Chiffres clés", en: "Key figures" },
  "projet.relatedNews": { fr: "Actualités liées", en: "Related news" },
  "projet.platforms": { fr: "Plateformes du projet", en: "Project platforms" },
  "projet.platformsDesc": {
    fr: "Les outils et plateformes numériques déployés dans le cadre de ce projet.",
    en: "The digital tools and platforms deployed as part of this project.",
  },
  "projet.phases": { fr: "Évolution du projet", en: "Project evolution" },
  "projet.phasesDesc": {
    fr: "Le déploiement progressif du projet à travers les pays et partenaires.",
    en: "The progressive deployment of the project across countries and partners.",
  },
  "projet.projetsMeres": { fr: "Projets mères", en: "Parent projects" },
  "projet.projetsMeresDesc": {
    fr: "Les projets principaux auxquels ce projet est rattaché.",
    en: "The main projects this project is linked to.",
  },
  "projet.parentProjet": { fr: "Projet parent", en: "Parent project" },
  "projet.gallery": { fr: "Galerie", en: "Gallery" },
  "projet.team": { fr: "Équipe du projet", en: "Project team" },

  "projectThemes.title": { fr: "Nos axes d'interventions", en: "Our areas of intervention" },
  "projectThemes.subtitle": {
    fr: "Découvrez nos axes d'intervention pour une Afrique numérique, démocratique et inclusive.",
    en: "Discover our areas of intervention for a digital, democratic and inclusive Africa.",
  },
  "projectThemes.innovation.desc": {
    fr: "Renforcer la participation citoyenne par l'innovation technologique, l'intelligence artificielle et l'endogénéité. Hackathons, solutions locales, CitizenLab et blockchain pour la gouvernance.",
    en: "Strengthening citizen participation through technological innovation, artificial intelligence and endogeneity. Hackathons, local solutions, CitizenLab and blockchain for governance.",
  },
  "projectThemes.democracy.desc": {
    fr: "Renforcer l'intégration du numérique dans les processus électoraux démocratiques en Afrique. Outils d'observation électorale, plateformes régionales et transparence électorale.",
    en: "Strengthening digital integration in democratic electoral processes in Africa. Electoral observation tools, regional platforms and electoral transparency.",
  },
  "projectThemes.engagement.desc": {
    fr: "Développer la dynamique de réseau et des communautés de bonnes pratiques panafricaines. Réseau AfricTivistes, programme ACET et Plateforme d'Intelligence Collective (PICA).",
    en: "Developing network dynamics and pan-African communities of good practices. AfricTivistes network, ACET programme and Collective Intelligence Platform (PICA).",
  },
  "projectThemes.media.desc": {
    fr: "Consolider la résilience des médias et des acteurs de l'information. Cybersécurité pour journalistes, lutte contre la désinformation et soutien aux médias indépendants.",
    en: "Consolidating the resilience of media and information actors. Cybersecurity for journalists, fight against disinformation and support for independent media.",
  },
  "projectThemes.training.desc": {
    fr: "Développer les programmes d'accès à la connaissance et la promotion de la recherche/action sur la démocratie et la participation citoyenne.",
    en: "Developing knowledge access programmes and promoting research/action on democracy and citizen participation.",
  },
  "projectThemes.explore": { fr: "Explorer", en: "Explore" },
  "projectThemes.allInitiatives.title": { fr: "Toutes nos initiatives", en: "All our initiatives" },
  "projectThemes.allInitiatives.desc": { fr: "Découvrez l'ensemble de nos projets et programmes en cours à travers le continent africain.", en: "Discover all our ongoing projects and programmes across the African continent." },
  "projectThemes.allInitiatives.cta": { fr: "Voir toutes les initiatives", en: "See all initiatives" },
  "projectThemes.joinNetwork.title": { fr: "Rejoindre AfricTivistes", en: "Join AfricTivistes" },
  "projectThemes.joinNetwork.desc": { fr: "Intégrez un réseau panafricain d'activistes du numérique engagés pour la démocratie et la citoyenneté.", en: "Join a pan-African network of digital activists committed to democracy and citizenship." },
  "projectThemes.joinNetwork.cta": { fr: "Devenir AfricTivistes", en: "Become an AfricTivist" },

  "platforms.title": { fr: "Nos plateformes web", en: "Our web platforms" },

  "releases.title": { fr: "Nos communiqués", en: "Press releases" },
  "releases.read": { fr: "Lire", en: "Read" },

  "videos.title": { fr: "Nos vidéos", en: "Our videos" },
  "videos.subtitle": {
    fr: "Retrouvez nos dernières productions vidéo : analyses, reportages et événements.",
    en: "Watch our latest video productions: analyses, reports and events.",
  },
  "videos.play": { fr: "Lire la vidéo", en: "Play video" },
  "videos.viewAll": { fr: "Voir toute la playlist", en: "View full playlist" },
  "videos.watchOnYt": { fr: "Voir sur YouTube", en: "Watch on YouTube" },
  "videos.noVideos": { fr: "Aucune vidéo disponible pour le moment.", en: "No videos available at the moment." },
  "videos.allPlaylists": { fr: "Toutes", en: "All" },
  "videos.filterLabel": { fr: "Filtrer par playlist", en: "Filter by playlist" },

  "news.title": { fr: "Nos dernières actualités", en: "Latest news" },
  "news.viewAll": { fr: "Voir toutes les actualités", en: "View all news" },

  "stats.title": { fr: "ans d'existence d'AfricTivistes en chiffres", en: "years of AfricTivistes in numbers" },
  "stats.trainees": { fr: "Bénéficiaires en présentiel des formations", en: "In-person training beneficiaries" },
  "stats.activists": { fr: "Activistes pro-démocratie et journalistes en danger appuyés", en: "Pro-democracy activists and at-risk journalists supported" },
  "stats.elections": { fr: "Élections présidentielles appuyées", en: "Presidential elections supported" },
  "stats.communities": { fr: "Communautés créées", en: "Communities created" },
  "stats.mooc": { fr: "Bénéficiaires en ligne des formations", en: "Online training beneficiaries" },
  "stats.summitParticipants": { fr: "Participants à nos activités", en: "Participants in our activities" },
  "stats.youth": { fr: "Jeunes appuyés", en: "Young people supported" },
  "stats.civicTech": { fr: "Initiatives civic tech appuyées", en: "Civic tech initiatives supported" },
  "stats.awards": { fr: "Distinctions décernées", en: "Awards received" },
  "stats.grants": { fr: "Subventions aux jeunes", en: "Grants to young people" },
  "stats.technical": { fr: "Appuis techniques", en: "Technical support" },
  "stats.research": { fr: "Recherches et analyses", en: "Research and analyses" },
  "stats.elearning": { fr: "Plateformes e-learning", en: "E-learning platforms" },

  "publications.title": { fr: "Nos dernières publications", en: "Our latest publications" },
  "publications.viewAll": { fr: "Voir toutes les publications", en: "View all publications" },

  "resources.publications.heroDesc": {
    fr: "Rapports, études et documents produits par AfricTivistes pour documenter et renforcer l'engagement civique en Afrique.",
    en: "Reports, studies and documents produced by AfricTivistes to document and strengthen civic engagement in Africa.",
  },
  "resources.publications.allTitle": { fr: "Toutes les publications", en: "All publications" },
  "resources.publications.empty": { fr: "Aucune publication disponible pour le moment.", en: "No publications available at the moment." },
  "resources.publications.count": { fr: "publications disponibles", en: "publications available" },

  "resources.toolkits.heroDesc": {
    fr: "Guides pratiques et boîtes à outils pour accompagner les acteurs du changement dans leurs actions civiques.",
    en: "Practical guides and toolkits to support changemakers in their civic actions.",
  },
  "resources.toolkits.allTitle": { fr: "Toutes les boîtes à outils", en: "All toolkits" },
  "resources.toolkits.empty": { fr: "Aucune boîte à outils disponible pour le moment.", en: "No toolkits available at the moment." },
  "resources.toolkits.count": { fr: "boîtes à outils disponibles", en: "toolkits available" },

  "champions.title": { fr: "Nos Champions pour l'engagement civique", en: "Our Champions for civic engagement" },
  "champions.readPortrait": { fr: "Lire le portrait", en: "Read the portrait" },

  "testimonials.label": { fr: "Témoignages", en: "Testimonials" },
  "testimonials.title": { fr: "Ce qu'ils disent de nous", en: "What they say about us" },
  "testimonials.subtitle": {
    fr: "Membres, partenaires et bénéficiaires partagent leur expérience avec AfricTivistes.",
    en: "Members, partners and beneficiaries share their experience with AfricTivistes.",
  },

  "partners.title": { fr: "Nos partenaires", en: "Our partners" },

  "newsletter.title": { fr: "Restez informé", en: "Stay informed" },
  "newsletter.desc": {
    fr: "Abonnez-vous à notre newsletter pour recevoir nos dernières actualités, publications et opportunités d'engagement.",
    en: "Subscribe to our newsletter to receive our latest news, publications and engagement opportunities.",
  },
  "newsletter.placeholder": { fr: "Votre adresse email", en: "Your email address" },
  "newsletter.subscribe": { fr: "S'abonner", en: "Subscribe" },
  "newsletter.thanks": { fr: "Merci pour votre inscription !", en: "Thank you for subscribing!" },
  "newsletter.soon": { fr: "Vous recevrez bientôt nos prochaines nouvelles.", en: "You will soon receive our latest news." },

  "footer.desc": {
    fr: "Ligue des Blogueurs et Cyber-activistes pour la Démocratie en Afrique.",
    en: "League of Bloggers and Cyber-activists for Democracy in Africa.",
  },
  "footer.newsletter": { fr: "Newsletter", en: "Newsletter" },
  "footer.receiveNewsletter": { fr: "Recevez notre newsletter", en: "Receive our newsletter" },
  "footer.navigation": { fr: "Navigation", en: "Navigation" },
  "footer.contact": { fr: "Contact", en: "Contact" },
  "footer.equivalency": { fr: "Equivalency Determination", en: "Equivalency Determination" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },
  "footer.tagline": { fr: "Ligue panafricaine pour la citoyenneté numérique", en: "Pan-African league for digital citizenship" },

  "aboutPreview.label": { fr: "Qui sommes-nous", en: "Who we are" },
  "aboutPreview.title1": { fr: "La Ligue panafricaine pour la ", en: "The pan-African League for " },
  "aboutPreview.highlight": { fr: "citoyenneté numérique", en: "digital citizenship" },
  "aboutPreview.desc1": {
    fr: "Fondée en 2015 à Dakar, AfricTivistes est une organisation panafricaine de la société civile qui rassemble des blogueurs, des cyber-activistes et des acteurs du changement à travers 45 pays africains.",
    en: "Founded in 2015 in Dakar, AfricTivistes is a pan-African civil society organization that brings together bloggers, cyber-activists and change agents across 45 African countries.",
  },
  "aboutPreview.desc2": {
    fr: "Notre mission : utiliser le numérique et les nouvelles technologies pour renforcer la démocratie, promouvoir la bonne gouvernance et favoriser le développement durable sur le continent.",
    en: "Our mission: to use digital tools and new technologies to strengthen democracy, promote good governance and foster sustainable development across the continent.",
  },
  "aboutPreview.cta": { fr: "En savoir plus", en: "Learn more" },
  "aboutPreview.pillar1Title": { fr: "Former", en: "Train" },
  "aboutPreview.pillar1Desc": { fr: "Renforcer les capacités des acteurs du changement à travers des formations en ligne et en présentiel.", en: "Building the capacities of change agents through online and in-person training." },
  "aboutPreview.pillar2Title": { fr: "Connecter", en: "Connect" },
  "aboutPreview.pillar2Desc": { fr: "Créer des réseaux panafricains de blogueurs, activistes et citoyens engagés.", en: "Creating pan-African networks of bloggers, activists and engaged citizens." },
  "aboutPreview.pillar3Title": { fr: "Outiller", en: "Equip" },
  "aboutPreview.pillar3Desc": { fr: "Développer des plateformes et outils technologiques au service de la démocratie.", en: "Developing platforms and technological tools in service of democracy." },
  "aboutPreview.pillar4Title": { fr: "Mobiliser", en: "Mobilize" },
  "aboutPreview.pillar4Desc": { fr: "Engager les communautés dans la surveillance citoyenne et la redevabilité.", en: "Engaging communities in citizen monitoring and accountability." },
  "aboutPreview.pillarsLabel": { fr: "Notre approche", en: "Our approach" },
  "aboutPreview.ctaLabel": { fr: "En savoir plus sur AfricTivistes", en: "Learn more about AfricTivistes" },

  "stats.label": { fr: "Notre impact", en: "Our impact" },

  "about.title": { fr: "À propos d'AfricTivistes", en: "About AfricTivistes" },
  "about.subtitle": {
    fr: "La Ligue des Blogueurs et Cyber-activistes pour la Démocratie en Afrique, fondée en 2015 à Dakar, rassemble des acteurs du changement à travers le continent.",
    en: "The League of Bloggers and Cyber-activists for Democracy in Africa, founded in 2015 in Dakar, brings together change agents across the continent.",
  },
  "about.missionTitle": { fr: "Notre mission", en: "Our mission" },
  "about.missionSubtitle1": { fr: "Le numérique au service de la ", en: "Digital technology in service of " },
  "about.missionHighlight": { fr: "démocratie africaine", en: "African democracy" },
  "about.mission1": {
    fr: "AfricTivistes est une organisation panafricaine de la société civile qui utilise le numérique et les nouvelles technologies pour renforcer la démocratie, promouvoir la bonne gouvernance et favoriser le développement durable en Afrique.",
    en: "AfricTivistes is a pan-African civil society organization that uses digital tools and new technologies to strengthen democracy, promote good governance and foster sustainable development in Africa.",
  },
  "about.mission2": {
    fr: "Nous croyons fermement que la technologie peut être un puissant levier de transformation sociale lorsqu'elle est mise au service des citoyens et de l'intérêt général.",
    en: "We firmly believe that technology can be a powerful lever for social transformation when it serves citizens and the public interest.",
  },
  "about.approachTitle": { fr: "Notre approche", en: "Our approach" },
  "about.approachSubtitle": { fr: "Comment nous agissons", en: "How we take action" },
  "about.approach1Title": { fr: "Former", en: "Train" },
  "about.approach1Desc": {
    fr: "Renforcer les capacités des acteurs du changement à travers des formations en ligne et en présentiel.",
    en: "Build the capacities of change agents through online and in-person training.",
  },
  "about.approach2Title": { fr: "Connecter", en: "Connect" },
  "about.approach2Desc": {
    fr: "Créer des réseaux panafricains de blogueurs, activistes et citoyens engagés.",
    en: "Create pan-African networks of bloggers, activists and engaged citizens.",
  },
  "about.approach3Title": { fr: "Outiller", en: "Equip" },
  "about.approach3Desc": {
    fr: "Développer des plateformes et outils technologiques au service de la démocratie.",
    en: "Develop platforms and technological tools in service of democracy.",
  },
  "about.approach4Title": { fr: "Mobiliser", en: "Mobilize" },
  "about.approach4Desc": {
    fr: "Engager les communautés dans la surveillance citoyenne et la redevabilité.",
    en: "Engage communities in citizen monitoring and accountability.",
  },
  "about.valuesTitle": { fr: "Nos valeurs", en: "Our values" },
  "about.valuesSubtitle": { fr: "Ce qui nous guide", en: "What guides us" },
  "about.val1Title": { fr: "Engagement civique", en: "Civic engagement" },
  "about.val1Desc": { fr: "Mobiliser les citoyens pour une participation active à la vie démocratique.", en: "Mobilizing citizens for active participation in democratic life." },
  "about.val2Title": { fr: "Solidarité panafricaine", en: "Pan-African solidarity" },
  "about.val2Desc": { fr: "Unir les forces du continent pour défendre les droits numériques.", en: "Uniting the continent's forces to defend digital rights." },
  "about.val3Title": { fr: "Inclusion numérique", en: "Digital inclusion" },
  "about.val3Desc": { fr: "Garantir l'accès et la participation de tous aux outils numériques.", en: "Ensuring access and participation for all in digital tools." },
  "about.val4Title": { fr: "Transparence", en: "Transparency" },
  "about.val4Desc": { fr: "Promouvoir la gouvernance ouverte et la redevabilité des institutions.", en: "Promoting open governance and institutional accountability." },
  "about.ctaTitle": { fr: "Rejoignez l'organisation", en: "Join the organization" },
  "about.ctaDesc": {
    fr: "Ensemble, construisons une Afrique numérique, démocratique et inclusive. Rejoignez notre réseau de plus de 400 membres actifs dans 45 pays.",
    en: "Together, let's build a digital, democratic and inclusive Africa. Join our network of over 400 active members in 45 countries.",
  },
  "about.ctaBtn": { fr: "Nous contacter", en: "Contact us" },
  "about.impactLabel": { fr: "Notre impact", en: "Our impact" },
  "about.impactTitle": { fr: "AfricTivistes en chiffres", en: "AfricTivistes in numbers" },
  "about.yearsExistence": { fr: "ans d'existence", en: "years of existence" },
  "about.stat.benefPresential": { fr: "Bénéficiaires en présentiel des formations", en: "In-person training beneficiaries" },
  "about.stat.activists": { fr: "Activistes pro-démocratie et journalistes en danger appuyés", en: "Pro-democracy activists and journalists at risk supported" },
  "about.stat.elections": { fr: "Élections présidentielles appuyées", en: "Presidential elections supported" },
  "about.stat.communities": { fr: "Communautés créées", en: "Communities created" },
  "about.stat.benefOnline": { fr: "Bénéficiaires en ligne des formations", en: "Online training beneficiaries" },
  "about.stat.participants": { fr: "Participants à nos activités", en: "Participants in our activities" },
  "about.stat.youth": { fr: "Jeunes appuyés", en: "Young people supported" },
  "about.stat.civicTech": { fr: "Initiatives civic tech appuyées", en: "Civic tech initiatives supported" },
  "about.stat.awards": { fr: "Distinctions décernées", en: "Awards received" },
  "about.stat.grants": { fr: "Subventions aux jeunes", en: "Grants to young people" },
  "about.stat.technical": { fr: "Appuis techniques", en: "Technical support" },
  "about.stat.research": { fr: "Recherches et analyses", en: "Research and analyses" },
  "about.stat.elearning": { fr: "Plateformes e-learning", en: "E-learning platforms" },
  "about.countries": { fr: "Pays couverts", en: "Countries covered" },
  "about.activeMembers": { fr: "Membres actifs", en: "Active members" },
  "about.yearsLabel": { fr: "Années d'engagement", en: "Years of engagement" },
  "about.yearsSuffix": { fr: "ans", en: "yrs" },
  "about.communities": { fr: "Communautés propulsées", en: "Communities empowered" },
  "about.milestone2015": { fr: "Création d'AfricTivistes à Dakar, Sénégal", en: "Creation of AfricTivistes in Dakar, Senegal" },
  "about.milestone2017": { fr: "Lancement du premier Sommet AfricTivistes", en: "Launch of the first AfricTivistes Summit" },
  "about.milestone2019": { fr: "Déploiement des programmes Civic Tech dans 15 pays", en: "Deployment of Civic Tech programmes in 15 countries" },
  "about.milestone2021": { fr: "Lancement de la plateforme MOOC avec 2000+ apprenants", en: "Launch of the MOOC platform with 2000+ learners" },
  "about.milestone2023": { fr: "Expansion à 45 pays et 400+ membres actifs", en: "Expansion to 45 countries and 400+ active members" },

  "contact.title": { fr: "Contact", en: "Contact" },
  "contact.subtitle": { fr: "Une question, une proposition de partenariat ? Contactez-nous.", en: "A question, a partnership proposal? Contact us." },
  "contact.name": { fr: "Nom", en: "Name" },
  "contact.namePlaceholder": { fr: "Votre nom", en: "Your name" },
  "contact.email": { fr: "Email", en: "Email" },
  "contact.subject": { fr: "Sujet", en: "Subject" },
  "contact.subjectPlaceholder": { fr: "Sujet de votre message", en: "Subject of your message" },
  "contact.message": { fr: "Message", en: "Message" },
  "contact.messagePlaceholder": { fr: "Votre message...", en: "Your message..." },
  "contact.send": { fr: "Envoyer", en: "Send" },
  "contact.thanks": { fr: "Merci pour votre message !", en: "Thank you for your message!" },
  "contact.reply": { fr: "Nous vous répondrons dans les meilleurs délais.", en: "We will get back to you as soon as possible." },

  "blog.title": { fr: "Actualités", en: "News" },
  "blog.subtitle": {
    fr: "Communiqués, plaidoyers, contributions et portraits de nos champions pour la démocratie numérique en Afrique.",
    en: "Press releases, advocacy, contributions and portraits of our champions for digital democracy in Africa.",
  },
  "blog.all": { fr: "Tous les articles", en: "All articles" },
  "blog.noArticles": { fr: "Aucun article trouvé.", en: "No articles found." },
  "blog.read": { fr: "Lire", en: "Read" },
  "blog.articlesCount": { fr: "articles", en: "articles" },
  "blog.articleCount": { fr: "article", en: "article" },
  "blog.communiques": { fr: "Communiqués", en: "Press releases" },
  "blog.plaidoyers": { fr: "Plaidoyers", en: "Advocacy" },
  "blog.actualites": { fr: "Actualités", en: "News" },
  "blog.contributions": { fr: "Contributions", en: "Contributions" },
  "blog.champions": { fr: "Champions", en: "Champions" },

  "blogPost.back": { fr: "Retour aux actualités", en: "Back to news" },
  "blogPost.notFound": { fr: "Article non trouvé", en: "Article not found" },
  "blogPost.share": { fr: "Partager", en: "Share" },

  "programme.back": { fr: "Retour aux initiatives", en: "Back to initiatives" },
  "programme.notFound": { fr: "Programme non trouvé", en: "Programme not found" },
  "programme.notFoundDesc": {
    fr: "Le programme que vous recherchez n'existe pas ou a été déplacé.",
    en: "The programme you are looking for does not exist or has been moved.",
  },
  "programme.type": { fr: "Type de programme", en: "Programme type" },
  "programme.label": { fr: "Étiquette", en: "Label" },
  "programme.similarTitle": { fr: "Programmes similaires", en: "Similar programmes" },
  "programme.similarDesc": {
    fr: "Découvrez d'autres programmes de la même thématique.",
    en: "Discover other programmes in the same category.",
  },
  "programme.viewAll": { fr: "Voir tous les programmes", en: "View all programmes" },
  "programme.objectives": { fr: "Objectif(s)", en: "Objective(s)" },
  "programme.budget": { fr: "Budget", en: "Budget" },
  "programme.duration": { fr: "Durée", en: "Duration" },
  "programme.months": { fr: "mois", en: "months" },
  "programme.participants": { fr: "Participants", en: "Participants" },
  "programme.countries": { fr: "Pays", en: "Countries" },
  "programme.projectBy": { fr: "Un projet", en: "A project by" },
  "programme.supportedBy": { fr: "Soutenu par", en: "Supported by" },
  "programme.partnersWith": { fr: "En partenariat avec", en: "In partnership with" },
  "programme.progress": { fr: "Avancement du projet", en: "Project progress" },
  "programme.presentation": { fr: "Présentation", en: "Presentation" },
  "programme.actions": { fr: "Actions", en: "Actions" },
  "programme.beneficiaries": { fr: "Bénéficiaires du projet", en: "Project beneficiaries" },
  "programme.manager": { fr: "Responsable du projet", en: "Project manager" },
  "programme.seeDetails": { fr: "Voir le détail", en: "See details" },
  "programme.startDate": { fr: "Date de début", en: "Start date" },
  "programme.endDate": { fr: "Date de fin", en: "End date" },
  "programme.status.active": { fr: "En cours", en: "Active" },
  "programme.status.completed": { fr: "Terminé", en: "Completed" },
  "programme.status.upcoming": { fr: "À venir", en: "Upcoming" },
  "programme.keyFigures": { fr: "Chiffres clés", en: "Key figures" },
  "programme.trained": { fr: "Personnes formées", en: "People trained" },
  "programme.website": { fr: "Site web", en: "Website" },
  "programme.relatedNews": { fr: "Actualités liées", en: "Related news" },
  "programme.platforms": { fr: "Plateformes du projet", en: "Project platforms" },
  "programme.platformsDesc": {
    fr: "Les outils et plateformes numériques déployés dans le cadre de ce programme.",
    en: "The digital tools and platforms deployed as part of this programme.",
  },

  "history.title": { fr: "Notre Histoire", en: "Our History" },
  "history.subtitle": {
    fr: "Depuis 2015, AfricTivistes construit une citoyenneté numérique active en Afrique. Retour sur les moments clés de notre parcours.",
    en: "Since 2015, AfricTivistes has been building active digital citizenship in Africa. A look back at the key moments of our journey.",
  },
  "history.originLabel": { fr: "Les origines", en: "Origins" },
  "history.originTitle1": { fr: "D'une idée audacieuse à un ", en: "From a bold idea to a " },
  "history.originHighlight": { fr: "mouvement panafricain", en: "pan-African movement" },
  "history.originDesc1": {
    fr: "AfricTivistes est née en 2015 à Dakar, au Sénégal, de la volonté de blogueurs et cyber-activistes africains de s'organiser pour promouvoir la démocratie et la bonne gouvernance à travers le numérique. Ce qui a commencé comme un réseau informel est devenu une organisation panafricaine structurée, présente dans 45 pays du continent.",
    en: "AfricTivistes was born in 2015 in Dakar, Senegal, from the desire of African bloggers and cyber-activists to organize themselves to promote democracy and good governance through digital tools. What started as an informal network has become a structured pan-African organization, present in 45 countries across the continent.",
  },
  "history.originDesc2": {
    fr: "Portée par la conviction que le numérique est un puissant levier de transformation sociale, l'organisation a rapidement rassemblé des acteurs du changement engagés pour une Afrique plus transparente, inclusive et démocratique.",
    en: "Driven by the conviction that digital technology is a powerful lever for social transformation, the organization quickly brought together change agents committed to a more transparent, inclusive and democratic Africa.",
  },
  "history.timelineLabel": { fr: "Chronologie", en: "Timeline" },
  "history.timelineTitle": { fr: "Les grandes étapes de notre parcours", en: "Key milestones in our journey" },
  "history.2015title": { fr: "Fondation à Dakar", en: "Founded in Dakar" },
  "history.2015desc": {
    fr: "Création de la Ligue des Blogueurs et Cyber-activistes pour la Démocratie en Afrique lors d'une rencontre historique à Dakar, Sénégal. Les premiers membres fondateurs posent les bases d'un réseau panafricain inédit.",
    en: "Creation of the League of Bloggers and Cyber-activists for Democracy in Africa during a historic meeting in Dakar, Senegal. The founding members lay the foundations of an unprecedented pan-African network.",
  },
  "history.2016title": { fr: "Premières actions de terrain", en: "First field actions" },
  "history.2016desc": {
    fr: "Déploiement des premières campagnes de sensibilisation numérique et observation citoyenne des élections dans plusieurs pays africains. AfricTivistes commence à se faire connaître comme acteur incontournable de la civic tech en Afrique.",
    en: "Deployment of the first digital awareness campaigns and citizen election observation in several African countries. AfricTivistes begins to establish itself as a key player in civic tech in Africa.",
  },
  "history.2017title": { fr: "Premier Sommet AfricTivistes", en: "First AfricTivistes Summit" },
  "history.2017desc": {
    fr: "Organisation du premier Sommet AfricTivistes à Dakar, rassemblant des activistes, blogueurs et acteurs de la société civile de tout le continent. Cet événement fondateur consolide le réseau et lance une dynamique collective durable.",
    en: "Organization of the first AfricTivistes Summit in Dakar, bringing together activists, bloggers and civil society actors from across the continent. This founding event strengthens the network and launches a lasting collective dynamic.",
  },
  "history.2018title": { fr: "Expansion régionale", en: "Regional expansion" },
  "history.2018desc": {
    fr: "Élargissement du réseau à l'Afrique de l'Est et à l'Afrique centrale. Lancement de programmes de formation en ligne pour les blogueurs et cyber-activistes. Premiers partenariats institutionnels avec des organisations internationales.",
    en: "Expansion of the network to East Africa and Central Africa. Launch of online training programs for bloggers and cyber-activists. First institutional partnerships with international organizations.",
  },
  "history.2019title": { fr: "Civic Tech dans 15 pays", en: "Civic Tech in 15 countries" },
  "history.2019desc": {
    fr: "Déploiement des programmes Civic Tech dans 15 pays africains. Lancement de plateformes d'observation électorale et d'outils numériques pour la transparence gouvernementale. AfricTivistes s'impose comme référence continentale.",
    en: "Deployment of Civic Tech programs in 15 African countries. Launch of electoral observation platforms and digital tools for government transparency. AfricTivistes establishes itself as a continental reference.",
  },
  "history.2020title": { fr: "Résilience numérique", en: "Digital resilience" },
  "history.2020desc": {
    fr: "Face à la pandémie mondiale, AfricTivistes adapte ses programmes au format numérique. Lancement de campagnes de lutte contre la désinformation liée au COVID-19. Renforcement des capacités des médias africains en ligne.",
    en: "Facing the global pandemic, AfricTivistes adapts its programs to digital formats. Launch of campaigns against COVID-19 disinformation. Strengthening of African online media capacities.",
  },
  "history.2021title": { fr: "Plateforme MOOC", en: "MOOC Platform" },
  "history.2021desc": {
    fr: "Lancement de la plateforme de formation en ligne (MOOC) avec plus de 2 000 apprenants inscrits dès la première année. Création du programme ACET pour l'accompagnement des communautés numériques.",
    en: "Launch of the online training platform (MOOC) with over 2,000 learners enrolled in the first year. Creation of the ACET program for supporting digital communities.",
  },
  "history.2022title": { fr: "Deuxième Sommet continental", en: "Second continental Summit" },
  "history.2022desc": {
    fr: "Organisation du deuxième Sommet AfricTivistes, réunissant plus de 300 participants de 35 pays. Lancement de nouveaux programmes sur la cybersécurité pour les journalistes et la résilience informationnelle.",
    en: "Organization of the second AfricTivistes Summit, gathering over 300 participants from 35 countries. Launch of new programs on cybersecurity for journalists and informational resilience.",
  },
  "history.2023title": { fr: "45 pays, 400+ membres", en: "45 countries, 400+ members" },
  "history.2023desc": {
    fr: "Expansion du réseau à 45 pays africains avec plus de 400 membres actifs. Consolidation des programmes phares et lancement de nouvelles initiatives sur l'intelligence artificielle et la participation citoyenne.",
    en: "Expansion of the network to 45 African countries with over 400 active members. Consolidation of flagship programs and launch of new initiatives on artificial intelligence and citizen participation.",
  },
  "history.2024title": { fr: "Innovation et IA", en: "Innovation and AI" },
  "history.2024desc": {
    fr: "Intégration de l'intelligence artificielle dans les programmes de formation et de civic tech. Développement de CitizenLab et de nouveaux outils d'observation électorale. Partenariats renforcés avec les institutions panafricaines.",
    en: "Integration of artificial intelligence into training and civic tech programs. Development of CitizenLab and new electoral observation tools. Strengthened partnerships with pan-African institutions.",
  },
  "history.2025title": { fr: "Vers une nouvelle décennie", en: "Towards a new decade" },
  "history.2025desc": {
    fr: "Célébration des 10 ans d'AfricTivistes. Lancement d'une vision stratégique pour la prochaine décennie, axée sur l'endogénéité technologique, le renforcement de la démocratie numérique et la souveraineté des données en Afrique.",
    en: "Celebration of AfricTivistes' 10th anniversary. Launch of a strategic vision for the next decade, focused on technological endogeneity, strengthening digital democracy and data sovereignty in Africa.",
  },
  "history.statsLabel": { fr: "En chiffres", en: "In numbers" },
  "history.statsTitle": { fr: "10 ans d'impact sur le continent", en: "10 years of impact across the continent" },
  "history.stat1Value": { fr: "45", en: "45" },
  "history.stat1Label": { fr: "Pays couverts", en: "Countries covered" },
  "history.stat2Value": { fr: "400+", en: "400+" },
  "history.stat2Label": { fr: "Membres actifs", en: "Active members" },
  "history.stat3Value": { fr: "10", en: "10" },
  "history.stat3Label": { fr: "Années d'engagement", en: "Years of engagement" },
  "history.stat4Value": { fr: "2 000+", en: "2,000+" },
  "history.stat4Label": { fr: "Apprenants formés", en: "Learners trained" },
  "history.stat5Value": { fr: "15+", en: "15+" },
  "history.stat5Label": { fr: "Élections couvertes", en: "Elections covered" },
  "history.stat6Value": { fr: "8", en: "8" },
  "history.stat6Label": { fr: "Communautés propulsées", en: "Communities empowered" },
  "history.visionLabel": { fr: "Notre vision", en: "Our vision" },
  "history.visionTitle": { fr: "Construire l'avenir numérique de l'Afrique", en: "Building Africa's digital future" },
  "history.visionDesc": {
    fr: "Forte de 10 années d'expérience et d'un réseau de plus de 400 membres dans 45 pays, AfricTivistes poursuit sa mission avec une vision renouvelée : faire du numérique un outil d'émancipation citoyenne, de transparence démocratique et de développement durable pour le continent africain.",
    en: "With 10 years of experience and a network of over 400 members in 45 countries, AfricTivistes continues its mission with a renewed vision: making digital technology a tool for citizen empowerment, democratic transparency and sustainable development for the African continent.",
  },
  "history.ctaTitle": { fr: "Faites partie de l'histoire", en: "Be part of the story" },
  "history.ctaDesc": {
    fr: "Rejoignez l'organisation AfricTivistes et contribuez à écrire le prochain chapitre de la citoyenneté numérique en Afrique.",
    en: "Join the AfricTivistes organization and help write the next chapter of digital citizenship in Africa.",
  },
  "history.ctaBtn": { fr: "Nous rejoindre", en: "Join us" },

  "values.title": { fr: "Nos Valeurs", en: "Our Values" },
  "values.subtitle": {
    fr: "Les principes fondamentaux qui guident chacune de nos actions et façonnent notre vision d'une Afrique numérique, démocratique et inclusive.",
    en: "The core principles that guide each of our actions and shape our vision of a digital, democratic and inclusive Africa.",
  },
  "values.introLabel": { fr: "Ce qui nous anime", en: "What drives us" },
  "values.introTitle1": { fr: "Des convictions fortes pour une ", en: "Strong convictions for a " },
  "values.introHighlight": { fr: "Afrique transformée", en: "transformed Africa" },
  "values.introDesc1": {
    fr: "Chez AfricTivistes, nos valeurs ne sont pas de simples mots. Elles sont le socle de chacune de nos initiatives, le fil conducteur de nos programmes et la boussole de nos engagements. Elles reflètent notre identité panafricaine et notre détermination à utiliser le numérique comme outil d'émancipation citoyenne.",
    en: "At AfricTivistes, our values are not mere words. They are the foundation of each of our initiatives, the guiding thread of our programs and the compass of our commitments. They reflect our pan-African identity and our determination to use digital technology as a tool for citizen empowerment.",
  },
  "values.introDesc2": {
    fr: "Chaque valeur porte en elle une promesse : celle de contribuer à bâtir des sociétés africaines où chaque citoyen a les moyens de participer activement à la vie démocratique.",
    en: "Each value carries a promise: that of contributing to building African societies where every citizen has the means to actively participate in democratic life.",
  },

  "values.coreLabel": { fr: "Valeurs fondamentales", en: "Core values" },
  "values.coreTitle": { fr: "Les piliers de notre engagement", en: "The pillars of our commitment" },

  "values.civic.title": { fr: "Engagement civique", en: "Civic engagement" },
  "values.civic.desc": {
    fr: "Mobiliser les citoyens pour une participation active à la vie démocratique. Nous croyons que chaque voix compte et que le numérique peut amplifier l'expression citoyenne à travers tout le continent.",
    en: "Mobilizing citizens for active participation in democratic life. We believe every voice matters and that digital technology can amplify citizen expression across the entire continent.",
  },
  "values.civic.detail1": { fr: "Observation électorale citoyenne", en: "Citizen election observation" },
  "values.civic.detail2": { fr: "Plaidoyer pour les droits numériques", en: "Advocacy for digital rights" },
  "values.civic.detail3": { fr: "Formation à la participation démocratique", en: "Training in democratic participation" },

  "values.solidarity.title": { fr: "Solidarité panafricaine", en: "Pan-African solidarity" },
  "values.solidarity.desc": {
    fr: "Unir les forces du continent pour défendre les droits numériques et renforcer la coopération entre les acteurs du changement. Notre réseau transcende les frontières pour créer un mouvement collectif puissant.",
    en: "Uniting the continent's forces to defend digital rights and strengthen cooperation among change agents. Our network transcends borders to create a powerful collective movement.",
  },
  "values.solidarity.detail1": { fr: "Réseau dans 45 pays africains", en: "Network across 45 African countries" },
  "values.solidarity.detail2": { fr: "Échanges inter-communautaires", en: "Inter-community exchanges" },
  "values.solidarity.detail3": { fr: "Entraide entre activistes", en: "Mutual aid among activists" },

  "values.inclusion.title": { fr: "Inclusion numérique", en: "Digital inclusion" },
  "values.inclusion.desc": {
    fr: "Garantir l'accès et la participation de tous aux outils numériques, sans distinction de genre, de langue ou de localisation géographique. Le numérique doit être un espace d'égalité et d'opportunité pour chaque Africain.",
    en: "Ensuring access and participation for all in digital tools, regardless of gender, language or geographic location. The digital space must be one of equality and opportunity for every African.",
  },
  "values.inclusion.detail1": { fr: "Programmes multilingues", en: "Multilingual programs" },
  "values.inclusion.detail2": { fr: "Accès aux communautés rurales", en: "Access for rural communities" },
  "values.inclusion.detail3": { fr: "Équité de genre dans le numérique", en: "Gender equity in digital" },

  "values.transparency.title": { fr: "Transparence", en: "Transparency" },
  "values.transparency.desc": {
    fr: "Promouvoir la gouvernance ouverte et la redevabilité des institutions. Nous exigeons des pouvoirs publics ce que nous nous imposons à nous-mêmes : la transparence totale dans la gestion et la prise de décision.",
    en: "Promoting open governance and institutional accountability. We demand from public authorities what we impose on ourselves: total transparency in management and decision-making.",
  },
  "values.transparency.detail1": { fr: "Données ouvertes et accessibles", en: "Open and accessible data" },
  "values.transparency.detail2": { fr: "Gouvernance participative", en: "Participatory governance" },
  "values.transparency.detail3": { fr: "Redevabilité institutionnelle", en: "Institutional accountability" },

  "values.innovation.title": { fr: "Innovation responsable", en: "Responsible innovation" },
  "values.innovation.desc": {
    fr: "Développer des solutions technologiques endogènes qui répondent aux réalités africaines. L'innovation n'a de sens que lorsqu'elle est au service des communautés et du bien commun.",
    en: "Developing endogenous technological solutions that address African realities. Innovation only makes sense when it serves communities and the common good.",
  },
  "values.innovation.detail1": { fr: "Solutions civic tech adaptées", en: "Adapted civic tech solutions" },
  "values.innovation.detail2": { fr: "Intelligence artificielle éthique", en: "Ethical artificial intelligence" },
  "values.innovation.detail3": { fr: "Technologies au service du bien commun", en: "Technologies serving the common good" },

  "values.resilience.title": { fr: "Résilience informationnelle", en: "Informational resilience" },
  "values.resilience.desc": {
    fr: "Renforcer la capacité des citoyens et des médias à résister à la désinformation et aux manipulations. Un espace informationnel sain est le fondement de toute démocratie vivante.",
    en: "Strengthening the capacity of citizens and media to resist disinformation and manipulation. A healthy information space is the foundation of any living democracy.",
  },
  "values.resilience.detail1": { fr: "Lutte contre la désinformation", en: "Fight against disinformation" },
  "values.resilience.detail2": { fr: "Fact-checking et vérification", en: "Fact-checking and verification" },
  "values.resilience.detail3": { fr: "Protection des journalistes", en: "Protection of journalists" },

  "values.principlesLabel": { fr: "Nos engagements", en: "Our commitments" },
  "values.principlesTitle": { fr: "Comment nos valeurs se traduisent en actions", en: "How our values translate into action" },
  "values.principle1Title": { fr: "Indépendance", en: "Independence" },
  "values.principle1Desc": {
    fr: "AfricTivistes est une organisation indépendante de tout parti politique, gouvernement ou intérêt privé. Cette indépendance garantit la crédibilité et l'impartialité de nos actions.",
    en: "AfricTivistes is an organization independent of any political party, government or private interest. This independence guarantees the credibility and impartiality of our actions.",
  },
  "values.principle2Title": { fr: "Impact mesurable", en: "Measurable impact" },
  "values.principle2Desc": {
    fr: "Chaque programme est conçu avec des indicateurs clairs et des objectifs mesurables. Nous rendons compte de nos résultats avec rigueur et honnêteté.",
    en: "Each program is designed with clear indicators and measurable objectives. We report on our results with rigor and honesty.",
  },
  "values.principle3Title": { fr: "Approche locale", en: "Local approach" },
  "values.principle3Desc": {
    fr: "Nos solutions sont co-construites avec les communautés locales. Nous respectons les contextes culturels et politiques de chaque pays d'intervention.",
    en: "Our solutions are co-created with local communities. We respect the cultural and political contexts of each country of intervention.",
  },
  "values.principle4Title": { fr: "Collaboration ouverte", en: "Open collaboration" },
  "values.principle4Desc": {
    fr: "Nous travaillons en partenariat avec les organisations de la société civile, les institutions académiques, les médias et les acteurs technologiques du continent.",
    en: "We work in partnership with civil society organizations, academic institutions, media and technology stakeholders across the continent.",
  },

  "values.quoteText": {
    fr: "Le numérique est le plus puissant levier de transformation sociale que l'Afrique ait jamais connu. Notre responsabilité est de le mettre au service de chaque citoyen.",
    en: "Digital technology is the most powerful lever of social transformation Africa has ever known. Our responsibility is to put it at the service of every citizen.",
  },
  "values.quoteAuthor": { fr: "Cheikh Fall", en: "Cheikh Fall" },
  "values.quoteRole": { fr: "Fondateur d'AfricTivistes", en: "Founder of AfricTivistes" },

  "values.ctaTitle": { fr: "Partagez nos valeurs ?", en: "Share our values?" },
  "values.ctaDesc": {
    fr: "Rejoignez une communauté de plus de 400 acteurs du changement qui agissent chaque jour pour une Afrique numérique, démocratique et inclusive.",
    en: "Join a community of over 400 change agents working every day for a digital, democratic and inclusive Africa.",
  },
  "values.ctaBtn": { fr: "Rejoindre le mouvement", en: "Join the movement" },

  "join.title": { fr: "Devenir AfricTivistes", en: "Become an AfricTivist" },
  "join.subtitle": {
    fr: "Rejoignez une communauté dynamique de citoyens engagés qui oeuvrent pour un changement positif en Afrique.",
    en: "Join a dynamic community of engaged citizens working for positive change in Africa.",
  },
  "join.communityLabel": { fr: "Notre communauté", en: "Our community" },
  "join.communityTitle1": { fr: "Rejoignez la Communauté ", en: "Join the " },
  "join.communityHighlight": { fr: "AfricTivistes", en: "AfricTivistes Community" },
  "join.communityDesc1": {
    fr: "AfricTivistes est bien plus qu'une organisation, c'est une communauté dynamique de citoyens engagés qui oeuvrent pour un changement positif en Afrique. Si vous partagez notre passion pour la démocratie, la participation citoyenne, la bonne gouvernance, l'innovation technologique et la défense des droits humains, alors vous êtes au bon endroit.",
    en: "AfricTivistes is much more than an organization, it is a dynamic community of engaged citizens working for positive change in Africa. If you share our passion for democracy, citizen participation, good governance, technological innovation and the defense of human rights, then you are in the right place.",
  },
  "join.whyLabel": { fr: "Vos avantages", en: "Your benefits" },
  "join.whyTitle": { fr: "Pourquoi nous rejoindre ?", en: "Why join us?" },
  "join.reason1Title": { fr: "Faire une Différence", en: "Make a Difference" },
  "join.reason1Desc": {
    fr: "En tant que membre d'AfricTivistes, vous serez au coeur de l'action pour un continent africain meilleur. Votre voix et votre engagement comptent.",
    en: "As a member of AfricTivistes, you will be at the heart of the action for a better African continent. Your voice and your commitment matter.",
  },
  "join.reason2Title": { fr: "Apprentissage et Croissance", en: "Learning and Growth" },
  "join.reason2Desc": {
    fr: "Accédez à notre plateforme de formation en ligne, explorez nos ressources éducatives et développez vos compétences en matière de citoyenneté active.",
    en: "Access our online training platform, explore our educational resources and develop your skills in active citizenship.",
  },
  "join.reason3Title": { fr: "Réseau Panafricain", en: "Pan-African Network" },
  "join.reason3Desc": {
    fr: "Connectez-vous avec d'autres citoyens engagés, des activistes, des journalistes et des professionnels du changement social dans toute l'Afrique.",
    en: "Connect with other engaged citizens, activists, journalists and social change professionals across Africa.",
  },
  "join.reason4Title": { fr: "Participation aux Projets", en: "Project Participation" },
  "join.reason4Desc": {
    fr: "Contribuez à nos projets et initiatives, de la lutte contre les fake news à la promotion de la cybersécurité et au-delà.",
    en: "Contribute to our projects and initiatives, from fighting fake news to promoting cybersecurity and beyond.",
  },
  "join.reason5Title": { fr: "Impact Concret", en: "Concrete Impact" },
  "join.reason5Desc": {
    fr: "Voyez vos actions se traduire par un impact concret sur la démocratie, les droits de l'homme et le développement en Afrique.",
    en: "See your actions translate into concrete impact on democracy, human rights and development in Africa.",
  },
  "join.howLabel": { fr: "Processus", en: "Process" },
  "join.howTitle": { fr: "Comment Adhérer", en: "How to Join" },
  "join.step1Title": { fr: "Remplissez le Formulaire", en: "Fill Out the Form" },
  "join.step1Desc": {
    fr: "Remplissez notre formulaire d'adhésion ci-dessous avec vos informations et motivations.",
    en: "Fill out our membership form below with your information and motivations.",
  },
  "join.step2Title": { fr: "Examen de candidature", en: "Application Review" },
  "join.step2Desc": {
    fr: "Votre candidature sera soigneusement examinée par notre équipe, incluant votre profil et vos activités.",
    en: "Your application will be carefully reviewed by our team, including your profile and activities.",
  },
  "join.step3Title": { fr: "Confirmation", en: "Confirmation" },
  "join.step3Desc": {
    fr: "Une fois votre adhésion approuvée, vous en serez informé(e) par courriel.",
    en: "Once your membership is approved, you will be notified by email.",
  },
  "join.step4Title": { fr: "Engagez-vous", en: "Get Involved" },
  "join.step4Desc": {
    fr: "Engagez-vous activement dans nos projets, partagez vos idées et contribuez à la transformation de l'Afrique.",
    en: "Get actively involved in our projects, share your ideas and contribute to the transformation of Africa.",
  },
  "join.formLabel": { fr: "Formulaire d'adhésion", en: "Membership form" },
  "join.formTitle": { fr: "Rejoignez-nous aujourd'hui", en: "Join us today" },
  "join.formDesc": {
    fr: "Remplissez ce formulaire pour soumettre votre candidature. Nous reviendrons vers vous dans les plus brefs délais.",
    en: "Fill out this form to submit your application. We will get back to you as soon as possible.",
  },
  "join.typeLabel": { fr: "Vous êtes", en: "You are" },
  "join.typePerson": { fr: "Une personne", en: "An individual" },
  "join.typeOrg": { fr: "Une organisation", en: "An organization" },
  "join.typeMovement": { fr: "Un mouvement", en: "A movement" },
  "join.firstName": { fr: "Prénom", en: "First name" },
  "join.firstNamePlaceholder": { fr: "Votre prénom", en: "Your first name" },
  "join.lastName": { fr: "Nom", en: "Last name" },
  "join.lastNamePlaceholder": { fr: "Votre nom", en: "Your last name" },
  "join.orgName": { fr: "Nom de l'organisation", en: "Organization name" },
  "join.orgNamePlaceholder": { fr: "Nom de votre organisation ou mouvement", en: "Name of your organization or movement" },
  "join.email": { fr: "Email", en: "Email" },
  "join.emailPlaceholder": { fr: "votre@email.com", en: "your@email.com" },
  "join.country": { fr: "Pays", en: "Country" },
  "join.countryPlaceholder": { fr: "Votre pays de résidence", en: "Your country of residence" },
  "join.motivation": { fr: "Motivation", en: "Motivation" },
  "join.motivationPlaceholder": {
    fr: "Pourquoi souhaitez-vous rejoindre AfricTivistes ?",
    en: "Why do you want to join AfricTivistes?",
  },
  "join.submit": { fr: "Envoyer ma candidature", en: "Submit my application" },
  "join.thanks": { fr: "Merci pour votre candidature !", en: "Thank you for your application!" },
  "join.thanksDesc": {
    fr: "Votre demande d'adhésion a bien été reçue. Notre équipe l'examinera et vous recevrez une réponse par courriel dans les prochains jours.",
    en: "Your membership request has been received. Our team will review it and you will receive a response by email in the coming days.",
  },
  "join.ctaTitle": { fr: "Ensemble, construisons l'avenir", en: "Together, let's build the future" },
  "join.ctaDesc": {
    fr: "Rejoignez-nous aujourd'hui et devenez un AfricTivistes, un acteur du changement en Afrique. Ensemble, nous pouvons bâtir un avenir meilleur pour notre continent.",
    en: "Join us today and become an AfricTivist, an agent of change in Africa. Together, we can build a better future for our continent.",
  },
  "join.ctaBtn": { fr: "Nous contacter", en: "Contact us" },

  "initiatives.heroLabel": { fr: "Nos initiatives", en: "Our initiatives" },
  "initiatives.planLabel": { fr: "Notre engagement", en: "Our commitment" },
  "initiatives.planTitle": {
    fr: "Impact et innovation technologique pour la démocratie en Afrique",
    en: "Impact and technological innovation for democracy in Africa",
  },
  "initiatives.planDesc1": {
    fr: "Réseau panafricain à l'intersection de la technologie et de la démocratie depuis sa création en 2015, AfricTivistes mobilise les acteurs de changement et partenaires qui partagent notre vision d'une Afrique où la civic tech sert de levier à la démocratie participative.",
    en: "A pan-African network at the intersection of technology and democracy since its creation in 2015, AfricTivistes mobilizes change agents and partners who share our vision of an Africa where civic tech serves as a lever for participatory democracy.",
  },
  "initiatives.planDesc2": {
    fr: "À travers ses axes d'intervention, le réseau panafricain accentue ses efforts pour promouvoir la démocratie, les droits humains et la gouvernance en Afrique par le biais de l'innovation technologique et de l'engagement citoyen.",
    en: "Through its areas of intervention, the pan-African network intensifies its efforts to promote democracy, human rights and governance in Africa through technological innovation and citizen engagement.",
  },
  "initiatives.themesLabel": { fr: "Nos axes d'interventions", en: "Our areas of intervention" },
  "initiatives.themesTitle": { fr: "Nos 5 axes d'intervention", en: "Our 5 areas of intervention" },
  "initiatives.themesSubtitle": {
    fr: "Les cinq piliers qui guident nos actions pour une Afrique numérique, démocratique et inclusive.",
    en: "The five pillars guiding our actions for a digital, democratic and inclusive Africa.",
  },
  "initiatives.allProjectsLabel": { fr: "Nos projets", en: "Our projects" },
  "initiatives.allProjectsTitle": { fr: "Tous les projets et initiatives", en: "All projects and initiatives" },
  "initiatives.allProjectsSubtitle": {
    fr: "Découvrez l'ensemble de nos projets classés par thématique.",
    en: "Discover all our projects organized by theme.",
  },

  "page.comingSoon": { fr: "Bientôt disponible", en: "Coming soon" },
  "page.comingSoonDesc": { fr: "Cette page est en cours de construction. Revenez bientôt pour découvrir son contenu.", en: "This page is under construction. Come back soon to discover its content." },
  "page.backHome": { fr: "Retour à l'accueil", en: "Back to home" },
};

const I18nContext = createContext<I18nContextType | null>(null);

function detectInitialLang(initialLang?: Lang): Lang {
  if (initialLang === "en" || initialLang === "fr") return initialLang;
  if (typeof document !== "undefined") {
    const htmlLang = document.documentElement.lang;
    if (htmlLang === "en" || htmlLang === "fr") return htmlLang;
  }
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.startsWith("/en")) return "en";
    if (path.startsWith("/fr")) return "fr";
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "fr") return saved;
    } catch {
      /* ignore */
    }
  }
  return "fr";
}

function navigateToLang(l: Lang) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("lang", l);
  } catch {
    /* ignore */
  }
  // Allow pages (e.g. BlogPost) to intercept and translate the slug
  // before we perform the default URL swap.
  const event = new CustomEvent("lang:request", {
    detail: { lang: l },
    cancelable: true,
  });
  window.dispatchEvent(event);
  if (event.defaultPrevented) return;

  const { pathname, search, hash } = window.location;
  let nextPath = pathname;
  if (pathname.startsWith("/fr") || pathname.startsWith("/en")) {
    nextPath = "/" + l + pathname.slice(3);
  } else {
    nextPath = "/" + l + (pathname === "/" ? "/" : pathname);
  }
  window.location.href = nextPath + search + hash;
}

function translate(key: string, lang: Lang): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.fr || key;
}

/**
 * Provider is now optional. When present, it overrides the detected language.
 * When absent, `useI18n` self-initializes from `<html lang>` / URL.
 *
 * Nested behaviour: when `initialLang` is not provided AND a parent
 * `I18nContext` is mounted, this provider becomes a pass-through (returns the
 * parent context). This prevents nested `withDataProviders` calls (e.g.
 * `ValuesHero` rendering `PageHero`) from resetting the language during SSR.
 */
export function I18nProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const parent = useContext(I18nContext);
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang(initialLang));

  const setLang = useCallback((l: Lang) => {
    if (typeof window !== "undefined") {
      navigateToLang(l);
      return;
    }
    setLangState(l);
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  // Pass-through: parent context already provides a language and caller
  // didn't ask for an explicit override.
  if (parent && !initialLang) {
    return <>{children}</>;
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

/**
 * Context-free fallback used when no `I18nProvider` is mounted (typical Astro page).
 */
function useStandaloneI18n(): I18nContextType {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  // Re-sync on mount in case `<html lang>` was set after first render
  useEffect(() => {
    const detected = detectInitialLang();
    if (detected !== lang) setLangState(detected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((l: Lang) => {
    if (typeof window !== "undefined") {
      navigateToLang(l);
      return;
    }
    setLangState(l);
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  return { lang, setLang, t };
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  // Fallback: no provider mounted (Astro page rendered directly).
  // We still call hooks unconditionally below to satisfy the rules of hooks.
  const standalone = useStandaloneI18n();
  return ctx ?? standalone;
}
