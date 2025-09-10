import { MetadataRoute } from 'next';

const countries = [
  'ae','af','am','ao','ar','at','au','az','ba','bd','be','bh','bo','br','by',
  'ca','ch','cl','cm','cn','co','cz','de','dk','do','dz','ec','eg','es','et','eu',
  'fi','fr','gh','gl','gr','hk','hn','ht','hu','id','il','in','iq','ir','it','jm',
  'jo','jp','ke','kr','kw','kz','lb','lk','lt','lv','ma','md','mg','mk','ms','mt',
  'mu','mw','mx','my','mz','na','ng','nl','no','np','nz','om','pe','pg','ph','pk',
  'pl','pr','pt','qa','ro','ru','rw','sa','sb','sc','sd','se','sg','sk','sl','sy',
  'th','tj','tn','tr','tw','tz','ua','ug','uk','us','uy','uz','ve','vn','ye','za',
  'zm','zw'
];

export default function sitemap(): MetadataRoute.Sitemap {
  return countries.map((c) => ({
    url: `https://${c}.mobgsm.com/sitemap/phones.xml`,
    lastModified: new Date(),
  }));
}
